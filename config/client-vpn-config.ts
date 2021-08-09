import {IClientVpnEndpointProps} from "../lib/client-vp-endpoint-props";

export const ClientVpnConfig: IClientVpnEndpointProps = {
    /**
     * Name of the client VPN endpoint
     *
     */
    name: "ClientVpnEndpoint",

    /**
     * Description of the client VPN endpoint
     *
     */
    description: "VPN for accessing private resources",

    /**
     * VPN endpoint is going to associate with this VPC
     *
     */
    associatedVpcId: "vpc-0f3827efe79059937",


    /**
     * Associated subnets for the VPN endpoint
     *
     */
    associatedSubnets: ["subnet-078c62a9f0a24b41d", "subnet-0e890c9543fdd23ee"],

    /**
     * Client CIDR
     *
     */
    clientCidr: "20.0.0.0/16",

    /**
     * Server certificate
     *
     */
    serverCertificateArn: "arn:aws:acm:us-east-1:1234560000:certificate/6540019e-faf8-4237-9f6f-cd3af6433f31",

    /**
     * Client certificate
     *
     */
    clientCertificateArn: "arn:aws:acm:us-east-1:1234560000:certificate/00bfb760-905e-4bcb-acb0-ae6618b0be9a",


    /**
     * CloudWatch log group
     *
     */
    enabledLogs: true,

    /**
     * Enable or disable split tunnel for the VPN
     *
     */
    splitTunnel: true,

    /**
     * Security groups  for the VPN
     *
     */
    securityGroups: [
        {
            name: "ClientVPN-SecurityGroup",
            ingressRules: [
                {
                    type: "SSH",
                    port: 22,
                    source: "0.0.0.0/0",
                    description: "SSH Access"
                }
            ]
        }
    ],

    /**
     * Authorization rules for the destination networks
     *
     */
    authorizationRules: [
        {
            "name": "DEV-PROD-Users",
            "destinationCIDR": "10.17.0.0/16",
            "adGroupSid": ""
        }
    ],

    /**
     * Authorization route table configurations for the destination networks
     *
     */
    routes: [
        {
            "name": "DEV-PROD-Route-1",
            "destinationCIDR": "10.17.0.0/16",
            "targetSubnetId": "subnet-0e890c9543fdd23ee",
        },
        {
            "name": "DEV-PROD-Route-2",
            "destinationCIDR": "10.17.0.0/16",
            "targetSubnetId": "subnet-078c62a9f0a24b41d",
        }
    ],

    /**
     * VPN VPC has peered with other VPCs
     *
     */
    vpcPeering: true,

    /**
     * Peered VPC connections with this VPN endpoint
     * crossAccount: Peering between two accounts
     * vpcId: Requester VPC
     * peerVpcId: Accepter VPC
     * peerOwnerId: Accepter account id
     * peerRoleArn: Cross account role ARN
     */
    vpcPeeringConnections:
        [
            {
                name: "DEV-PRD",
                crossAccount: true,
                vpcId: "vpc-0f3827efe79059937",
                peerVpcId: "vpc-037f694b5d0f94674",
                peerOwnerId: "549560551218",
                peerRegion: "us-east-1",
                peerRoleArn: "arn:aws:iam::20000000:role/CrossAccountPeeringRole",
                tags: [
                    {
                        key: "Name",
                        value: "DEV-PRD"
                    }
                ]
            }
        ]
}