// IF SERVER IS NOT AVAILABLE
export const REQUEST_TIMEOUT = 60_000;

export const DEFAULT_REGION = 'us-east-2';

const API = `api/`;

// localStorage
export const VCLUS_VPCS = "vclus-vpcs";
export const REGION_NAME = "region_name";
export const REGION_VALUE = "region_value";

// EC2
export const EC2_INSTANCES = API + 'ec2-instances';
export const EC2_INSTANCES_CREATE = API + 'ec2-instances/create';
export const EC2_INSTANCE_INFO = API + 'ec2-instances/info';
export const EC2_INSTANCES_START = API + 'ec2-instances/start/';
export const EC2_INSTANCES_STATE = API + 'ec2-instances/state/';
export const EC2_INSTANCES_STOP = API + 'ec2-instances/stop/';
export const EC2_INSTANCES_TERMINATE = API + 'ec2-instances/terminate/';
export const EC2_AMAZON_IMAGE_IDS = API + 'ec2-instances/amazon-image-ids';
export const EC2_KEY_PAIRS = API + 'ec2-instances/keypairs';
export const EC2_KEY_PAIR_DELETE = API + 'ec2-instances/keypairs/delete/';
export const EC2_KEY_PAIR_DOWNLOAD = API + 'ec2-instances/keypairs/download/';

// VPC
export const VPCS = API + 'vpcs';
export const GET_VPC = API + 'vpcs/';
export const CREATE_VPC = API + 'vpcs/create';
export const DELETE_VPC = API + 'vpcs/delete/';
export const VPC_SUBNETS = API + 'vpc/subnets/';

// SUBNET
export const SUBNETS = API + 'subnets';
export const CREATE_SUBNET = API + 'subnets/create';
export const DELETE_SUBNET = API + 'subnets/delete/';

// SECURITY GROUPS
export const SECURITY_GROUPS = API + 'security-groups';
export const CREATE_SECURITY_GROUP = API + 'security-groups/create';
export const SECURITY_GROUPS_CREATE_WITH_RULES = API + 'security-groups/create-with-rules';
export const DELETE_SECURITY_GROUP = API + 'security-groups/delete/';

// CLUSTER
export const VIRTUAL_CLUSTERS = API + 'virtual-clusters';
export const CREATE_CLUSTER = API + 'virtual-clusters/create';
export const DELETE_CLUSTER = API + 'virtual-clusters/delete/';
