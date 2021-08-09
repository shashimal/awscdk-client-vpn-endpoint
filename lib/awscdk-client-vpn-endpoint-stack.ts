import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import {ClientVpnConfig} from "../config/client-vpn-config";
import {ILogGroup, LogGroup, RetentionDays} from "@aws-cdk/aws-logs";
import {ISecurityGroupRule} from "./client-vp-endpoint-props";

export class AwscdkClientVpnEndpointStack extends cdk.Stack {

    private readonly appName: string;
    private readonly vpc: ec2.IVpc;
    private vpnEndpoint: ec2.ClientVpnEndpoint;

    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        this.appName = this.node.tryGetContext("appName");

        this.vpc = ec2.Vpc.fromLookup(this, `${this.appName}-${ClientVpnConfig.associatedVpcId}`, {
            vpcId: ClientVpnConfig.associatedVpcId
        });

        //Create VPC peering connections if the peering is enabled
        if (ClientVpnConfig.vpcPeering && ClientVpnConfig.vpcPeeringConnections) {
            this.createVpcPeeringConnections();
        }

        //Create the client VPN endpoint
        this.vpnEndpoint = this.createClientVpnEndpoint();

        //Configure the VPN endpoint
        this.configureClientVpnEndpoint();
    }

    /**
     * Create client VPN endpoint
     *
     */
    private createClientVpnEndpoint = (): ec2.ClientVpnEndpoint => {
        return new ec2.ClientVpnEndpoint(this, `${this.appName}`, {
            description: ClientVpnConfig.description,
            vpc: this.vpc,
            cidr: ClientVpnConfig.clientCidr,
            serverCertificateArn: ClientVpnConfig.serverCertificateArn,
            splitTunnel: ClientVpnConfig.splitTunnel,
            vpcSubnets: {
                subnets: this.getAssociatedSubnets()
            },
            ...(ClientVpnConfig.enabledLogs && {logGroup: this.createLogGroup()}),
            ...(ClientVpnConfig.securityGroups && {securityGroups: this.getSecurityGroups()}),
            ...(ClientVpnConfig.clientCertificateArn != null && { clientCertificateArn: ClientVpnConfig.clientCertificateArn }),
            ...(ClientVpnConfig.activeDirectoryId != null && { userBasedAuthentication: ec2.ClientVpnUserBasedAuthentication.activeDirectory(ClientVpnConfig.activeDirectoryId) })
        });
    }

    /**
     *
     Configure the client vpn endpoint
     */
    private configureClientVpnEndpoint = () => {
        this.addAuthorizationRules();
        this.addDestinationRoutes();
    }

    /**
     *
     Add authorization rules
     */
    private addAuthorizationRules = () => {
        if (ClientVpnConfig.authorizationRules && ClientVpnConfig.authorizationRules.length > 0) {
            for (let rule of ClientVpnConfig.authorizationRules) {
                rule.destinationCIDR != null &&
                this.vpnEndpoint.addAuthorizationRule(rule.name, {
                    cidr: rule.destinationCIDR,
                    ...(rule.adGroupSid && { groupId: rule.adGroupSid }),
                });
            }
        }
    }

    /**
     * Client create log group for the vpn logs
     *
     */
    private addDestinationRoutes = () => {
        if (ClientVpnConfig.routes && ClientVpnConfig.routes.length > 0) {
            for (let route of ClientVpnConfig.routes) {
                route.destinationCIDR && this.vpnEndpoint.addRoute(route.name, {
                    cidr: route.destinationCIDR,
                    target: ec2.ClientVpnRouteTarget.subnet(ec2.Subnet.fromSubnetId(this, route.name, route.targetSubnetId)),
                    description: `${route.name}-${route.targetSubnetId}`
                });
            }
        }
    }

    /**
     * Client create log group for the vpn logs
     *
     */
    private createLogGroup = (): ILogGroup => {
        return new LogGroup(this, `${this.appName}-LogGroup`, {
            logGroupName: `${this.appName}-Logs`,
            retention: RetentionDays.INFINITE
        });
    }

    /**
     * Client security groups for the client vpn endpoint
     *
     */
    private getSecurityGroups = (): ec2.ISecurityGroup[] => {
        let securityGroups: ec2.ISecurityGroup[] = [];
        if (ClientVpnConfig.securityGroups) {
            for (let securityGroupRule of ClientVpnConfig.securityGroups) {
                securityGroups.push(this.createSecurityGroup(securityGroupRule));
            }
        }
        return securityGroups;
    }

    /**
     * Create security groups for the client vpn endpoint
     *
     */
    private createSecurityGroup = (rule: ISecurityGroupRule): ec2.ISecurityGroup => {
        const securityGroup = new ec2.SecurityGroup(this, `${this.appName}-${rule.name}`, {
            vpc: this.vpc,
            allowAllOutbound: true,
        })

        for (let ingressRule of rule.ingressRules) {
            securityGroup.addIngressRule(ec2.Peer.ipv4(ingressRule.source), ec2.Port.tcp(ingressRule.port), ingressRule.description);
        }
        return securityGroup;
    }

    /**
     *
     Create VPC peering connections
     */
    private createVpcPeeringConnections = () => {
        if (ClientVpnConfig.vpcPeeringConnections) {
            const connections = ClientVpnConfig.vpcPeeringConnections;
            for (let connection of connections) {
                const peeringConnection = new ec2.CfnVPCPeeringConnection(this, `${this.appName}-${connection.name}`, {
                    vpcId: connection.vpcId,
                    peerVpcId: connection.peerVpcId,
                    peerRegion: connection.peerRegion,
                    ...(connection.crossAccount && {peerOwnerId: connection.peerOwnerId}),
                    ...(connection.crossAccount && {peerRoleArn: connection.peerRoleArn}),
                    tags: connection.tags
                });
            }
        }
    }

    /**
     *
     * Get associated subnets of the VPN
     */
    private getAssociatedSubnets = (): ec2.ISubnet[] => {
        const subnets: ec2.ISubnet[] = [];
        if (ClientVpnConfig.associatedSubnets) {
            for (let subnetId of ClientVpnConfig.associatedSubnets) {
                subnets.push(ec2.Subnet.fromSubnetId(this, `${this.appName}-${subnetId}`, subnetId));
            }
        }
        return subnets;
    }
}