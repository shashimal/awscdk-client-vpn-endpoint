# Client VPN Endpoint (AWS CDK)

Purpose of this project is to automate the "Client VPN Endpoint" creation by using AWS CDK

AWS Client VPN is a managed client-based VPN service that enables you to securely access your AWS resources and resources in your on-premises network. With Client VPN, you can access your resources from any location using an OpenVPN-based VPN client.
[more](https://docs.aws.amazon.com/vpn/latest/clientvpn-admin/what-is.html)

## Configuration
IClientVpnEndpointProps has to be implemented with required parameters.
You can find the config file in **config/client-vpn-config**
So provide your values based on your requirement. For example,
```
     /**
     * Name of the client VPN endpoint
     *
     */
     name: "ClientVpnEndpoint",

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
    serverCertificateArn: "arn:aws:acm:us-east-1:000000:certificate/6540019e-faf8-4237-9f6f-cd3af6433f31",

    /**
     * Client certificate
     *
     */
    clientCertificateArn: "arn:aws:acm:us-east-1:000000:certificate/00bfb760-905e-4bcb-acb0-ae6618b0be9a",
```

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
