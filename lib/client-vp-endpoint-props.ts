export interface IClientVpnEndpointProps {
    name: string;
    description?: string;
    clientCidr: string;
    serverCertificateArn: string;
    associatedVpcId: string;
    associatedSubnets: string[];
    splitTunnel? : boolean;
    securityGroups? : ISecurityGroupRule[];
    authorizationRules? : IAuthorizationRule[];
    routes? : IRoutes[];
    vpcPeering?: boolean;
    clientCertificateArn?: string;
    activeDirectoryId?: string;
    vpcPeeringConnections?: IVpcPeeringConnection[];
    enabledLogs: boolean
}

export interface ISecurityGroupRule {
    name: string;
    ingressRules: ISecurityGroupIngressRule[];
}

export interface IAuthorizationRule {
    name: string;
    destinationCIDR: string;
    adGroupSid?: string;
}

export interface IRoutes {
    name: string;
    destinationCIDR: string;
    targetSubnetId: string;
}

export interface IVpcPeeringConnection {
    name: string;
    crossAccount?: boolean;
    vpcId: string;
    peerVpcId: string;
    peerOwnerId: string;
    peerRegion: string;
    peerRoleArn?: string;
    tags?: ITag[];
}

export interface ISecurityGroupIngressRule {
    type: string;
    port: number;
    source: string;
    description?: string;
}

export interface ITag {
    key: string;
    value: string;
}
