// PrepMaster - AWS Cloud Practitioner Question Database
// Created by Thomas Ashraf - https://github.com/thomas-x-69/prepmaster

export const questionDatabase = {
  fundamentals: [
    {
      id: 1,
      question: "What is the AWS Cloud value proposition?",
      options: [
        "Replace upfront capital infrastructure expenses with low variable costs",
        "Increase time to market for applications",
        "Reduce the need for security",
        "Eliminate the need for IT staff",
      ],
      correct: 0,
      explanation:
        "AWS allows you to trade capital expense for variable expense. You only pay for IT as you consume it, rather than investing heavily in data centers and servers before you know how you'll use them.",
    },
    {
      id: 2,
      question: "Which of the following is a characteristic of the AWS Cloud?",
      options: [
        "Fixed pricing regardless of usage",
        "Limited global infrastructure",
        "On-demand resource provisioning",
        "Single data center operations",
      ],
      correct: 2,
      explanation:
        "On-demand resource provisioning is a key characteristic of AWS Cloud, allowing you to provision computing resources as needed without upfront commitments.",
    },
    {
      id: 3,
      question:
        "What are the 6 advantages of cloud computing according to AWS?",
      options: [
        "Speed, reliability, security, cost, scale, innovation",
        "Trade capital expense for variable expense, benefit from massive economies of scale, stop guessing capacity, increase speed and agility, stop spending money on data centers, go global in minutes",
        "High availability, fault tolerance, scalability, elasticity, reliability, durability",
        "Compute, storage, networking, databases, analytics, machine learning",
      ],
      correct: 1,
      explanation:
        "AWS identifies 6 key advantages: trading CapEx for OpEx, benefiting from economies of scale, stopping capacity guessing, increasing agility, eliminating data center costs, and global reach.",
    },
    {
      id: 4,
      question: "What does 'elasticity' mean in cloud computing?",
      options: [
        "The ability to stretch a rubber band",
        "The ability to automatically scale resources up or down based on demand",
        "The ability to recover from failures",
        "The ability to store unlimited data",
      ],
      correct: 1,
      explanation:
        "Elasticity refers to the ability to automatically scale computing resources up or down based on actual demand, ensuring optimal performance and cost efficiency.",
    },
    {
      id: 5,
      question:
        "Which cloud deployment model gives you complete control over the underlying infrastructure?",
      options: [
        "Public Cloud",
        "Private Cloud",
        "Hybrid Cloud",
        "Community Cloud",
      ],
      correct: 1,
      explanation:
        "Private Cloud deployment gives you the most control over the underlying infrastructure as it's dedicated exclusively to your organization.",
    },
    {
      id: 6,
      question: "What is the AWS Well-Architected Framework?",
      options: [
        "A physical building design for AWS data centers",
        "A set of best practices for designing and operating reliable, secure, efficient systems",
        "A certification program for AWS architects",
        "A tool for monitoring AWS infrastructure",
      ],
      correct: 1,
      explanation:
        "The AWS Well-Architected Framework provides a set of best practices across five pillars: operational excellence, security, reliability, performance efficiency, and cost optimization.",
    },
    {
      id: 7,
      question:
        "What is the difference between scalability and elasticity in cloud computing?",
      options: [
        "There is no difference, they are the same thing",
        "Scalability is manual, elasticity is automatic",
        "Scalability is for storage, elasticity is for compute",
        "Scalability is cheaper than elasticity",
      ],
      correct: 1,
      explanation:
        "Scalability refers to the ability to increase capacity (manually or automatically), while elasticity specifically refers to the automatic scaling up or down based on demand.",
    },
  ],

  services: [
    {
      id: 1,
      question: "Which AWS service is primarily used for object storage?",
      options: ["Amazon EBS", "Amazon EFS", "Amazon S3", "Amazon RDS"],
      correct: 2,
      explanation:
        "Amazon S3 (Simple Storage Service) is AWS's object storage service that offers industry-leading scalability, data availability, security, and performance.",
    },
    {
      id: 2,
      question: "What is Amazon EC2?",
      options: [
        "A database service",
        "A virtual server service",
        "A content delivery network",
        "A monitoring service",
      ],
      correct: 1,
      explanation:
        "Amazon EC2 (Elastic Compute Cloud) provides scalable virtual servers in the cloud, allowing you to launch instances with various operating systems.",
    },
    {
      id: 3,
      question: "Which AWS service provides a content delivery network (CDN)?",
      options: ["Amazon CloudFront", "Amazon S3", "Amazon EC2", "Amazon VPC"],
      correct: 0,
      explanation:
        "Amazon CloudFront is AWS's fast content delivery network (CDN) service that securely delivers data, videos, applications, and APIs to customers globally.",
    },
    {
      id: 4,
      question: "Which AWS service is best for hosting a relational database?",
      options: [
        "Amazon DynamoDB",
        "Amazon RDS",
        "Amazon S3",
        "Amazon ElastiCache",
      ],
      correct: 1,
      explanation:
        "Amazon RDS (Relational Database Service) is specifically designed for hosting relational databases like MySQL, PostgreSQL, Oracle, and SQL Server.",
    },
    {
      id: 5,
      question: "What is the primary purpose of Amazon VPC?",
      options: [
        "Virtual Private Computing",
        "Virtual Private Cloud - isolated network environment",
        "Video Processing Center",
        "Virtual Payment Center",
      ],
      correct: 1,
      explanation:
        "Amazon VPC (Virtual Private Cloud) allows you to provision a logically isolated section of the AWS Cloud where you can launch AWS resources in a virtual network.",
    },
    {
      id: 6,
      question:
        "Which service would you use to send email notifications from your application?",
      options: ["Amazon SQS", "Amazon SNS", "Amazon SES", "Amazon Lambda"],
      correct: 2,
      explanation:
        "Amazon SES (Simple Email Service) is a cost-effective, flexible, and scalable email service that enables developers to send mail from within any application.",
    },
    {
      id: 7,
      question: "What is AWS Lambda?",
      options: [
        "A database service",
        "A serverless compute service",
        "A storage service",
        "A networking service",
      ],
      correct: 1,
      explanation:
        "AWS Lambda is a serverless compute service that lets you run code without provisioning or managing servers. You pay only for the compute time you consume.",
    },
    {
      id: 8,
      question: "Which AWS service provides DNS services?",
      options: [
        "Amazon CloudFront",
        "Amazon Route 53",
        "Amazon VPC",
        "Amazon Direct Connect",
      ],
      correct: 1,
      explanation:
        "Amazon Route 53 is a highly available and scalable cloud Domain Name System (DNS) web service designed to route end users to Internet applications.",
    },
  ],

  security: [
    {
      id: 1,
      question: "What is the AWS Shared Responsibility Model?",
      options: [
        "AWS is responsible for everything",
        "Customer is responsible for everything",
        "AWS secures the cloud infrastructure, customer secures what's in the cloud",
        "Security is not important in the cloud",
      ],
      correct: 2,
      explanation:
        "In the Shared Responsibility Model, AWS is responsible for security 'of' the cloud (infrastructure), while customers are responsible for security 'in' the cloud (their applications and data).",
    },
    {
      id: 2,
      question: "Which AWS service provides identity and access management?",
      options: ["AWS IAM", "AWS CloudTrail", "AWS Config", "AWS Inspector"],
      correct: 0,
      explanation:
        "AWS IAM (Identity and Access Management) enables you to manage access to AWS services and resources securely.",
    },
    {
      id: 3,
      question: "What is the principle of least privilege in AWS IAM?",
      options: [
        "Give users maximum permissions for convenience",
        "Give users only the minimum permissions they need to perform their job",
        "Give all users the same permissions",
        "Disable all permissions by default",
      ],
      correct: 1,
      explanation:
        "The principle of least privilege means granting users only the minimum permissions necessary to perform their required tasks, reducing security risks.",
    },
    {
      id: 4,
      question:
        "Which AWS service helps you monitor API calls made in your AWS account?",
      options: ["AWS CloudWatch", "AWS CloudTrail", "AWS Config", "AWS X-Ray"],
      correct: 1,
      explanation:
        "AWS CloudTrail is a service that enables governance, compliance, operational auditing, and risk auditing of your AWS account by logging API calls.",
    },
    {
      id: 5,
      question: "What is AWS KMS used for?",
      options: [
        "Key Management Service for encryption keys",
        "Kubernetes Management Service",
        "Knowledge Management System",
        "Kernel Module Support",
      ],
      correct: 0,
      explanation:
        "AWS KMS (Key Management Service) is a managed service that makes it easy to create and control encryption keys used to encrypt your data.",
    },
    {
      id: 6,
      question: "Which AWS service provides DDoS protection?",
      options: ["AWS WAF", "AWS Shield", "AWS GuardDuty", "AWS Inspector"],
      correct: 1,
      explanation:
        "AWS Shield is a managed DDoS protection service that safeguards applications running on AWS against distributed denial of service attacks.",
    },
  ],

  pricing: [
    {
      id: 1,
      question:
        "Which AWS pricing model allows you to pay for compute capacity by the hour or second?",
      options: [
        "Reserved Instances",
        "Spot Instances",
        "On-Demand Instances",
        "Dedicated Hosts",
      ],
      correct: 2,
      explanation:
        "On-Demand Instances let you pay for compute capacity by the hour or second (minimum of 60 seconds) with no long-term commitments.",
    },
    {
      id: 2,
      question: "What is the AWS Free Tier?",
      options: [
        "A paid support plan",
        "A limited free usage of AWS services for new customers",
        "An enterprise discount program",
        "A training certification program",
      ],
      correct: 1,
      explanation:
        "The AWS Free Tier provides limited free usage of many AWS services for 12 months after you create your AWS account, plus some services that are always free.",
    },
    {
      id: 3,
      question:
        "Which pricing model offers the greatest discount for EC2 instances?",
      options: [
        "On-Demand Instances",
        "Reserved Instances",
        "Spot Instances",
        "Dedicated Hosts",
      ],
      correct: 2,
      explanation:
        "Spot Instances can provide up to 90% discount compared to On-Demand prices, making them the most cost-effective option for flexible workloads.",
    },
    {
      id: 4,
      question: "What is AWS Cost Explorer?",
      options: [
        "A service to explore new AWS regions",
        "A tool to visualize and manage your AWS costs and usage",
        "A service to explore AWS documentation",
        "A tool to explore AWS service limits",
      ],
      correct: 1,
      explanation:
        "AWS Cost Explorer is a tool that enables you to view and analyze your costs and usage, helping you understand your spending patterns and identify cost optimization opportunities.",
    },
    {
      id: 5,
      question:
        "Which AWS support plan includes access to AWS Trusted Advisor's full set of checks?",
      options: [
        "Basic Support",
        "Developer Support",
        "Business Support",
        "All support plans include full Trusted Advisor",
      ],
      correct: 2,
      explanation:
        "Business Support and Enterprise Support plans include access to the full set of AWS Trusted Advisor checks, while Basic and Developer plans have limited access.",
    },
    {
      id: 6,
      question: "What are Reserved Instances?",
      options: [
        "Instances that are reserved for emergency use only",
        "Instances that provide a capacity reservation and significant discount",
        "Instances that are reserved for AWS internal use",
        "Instances that can only be used during specific hours",
      ],
      correct: 1,
      explanation:
        "Reserved Instances provide you with a significant discount (up to 75%) compared to On-Demand pricing and provide a capacity reservation when used in a specific Availability Zone.",
    },
  ],

  architecture: [
    {
      id: 1,
      question: "What does 'high availability' mean in AWS architecture?",
      options: [
        "Services are always running at maximum capacity",
        "Services remain operational even if some components fail",
        "Services are available only during business hours",
        "Services have the highest priority in AWS",
      ],
      correct: 1,
      explanation:
        "High availability refers to systems that remain operational and accessible even when some components fail, typically achieved through redundancy and failover mechanisms.",
    },
    {
      id: 2,
      question:
        "Which AWS feature helps you distribute traffic across multiple EC2 instances?",
      options: [
        "Auto Scaling",
        "Elastic Load Balancer",
        "CloudFront",
        "Route 53",
      ],
      correct: 1,
      explanation:
        "Elastic Load Balancer (ELB) distributes incoming application traffic across multiple targets, such as EC2 instances, to ensure high availability and fault tolerance.",
    },
    {
      id: 3,
      question: "What is an AWS Availability Zone?",
      options: [
        "A geographic region",
        "A data center or cluster of data centers within a region",
        "A virtual private network",
        "A storage location for backups",
      ],
      correct: 1,
      explanation:
        "An Availability Zone (AZ) is one or more discrete data centers with redundant power, networking, and connectivity in an AWS Region, designed to be isolated from failures in other AZs.",
    },
    {
      id: 4,
      question:
        "What is the difference between an AWS Region and an Availability Zone?",
      options: [
        "Regions are smaller than Availability Zones",
        "Regions contain multiple Availability Zones",
        "There is no difference",
        "Availability Zones are only for storage",
      ],
      correct: 1,
      explanation:
        "An AWS Region is a geographical area that contains multiple isolated Availability Zones. Each Region consists of multiple AZs to provide fault tolerance and high availability.",
    },
    {
      id: 5,
      question: "What is AWS Auto Scaling?",
      options: [
        "A service that automatically scales EC2 instances based on demand",
        "A service that automatically optimizes costs",
        "A service that automatically backs up data",
        "A service that automatically updates software",
      ],
      correct: 0,
      explanation:
        "AWS Auto Scaling monitors your applications and automatically adjusts capacity to maintain steady, predictable performance at the lowest possible cost.",
    },
  ],
};

// Export individual categories for easier maintenance
export const { fundamentals, services, security, pricing, architecture } =
  questionDatabase;
