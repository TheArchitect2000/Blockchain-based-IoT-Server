# Setup Checklist - What to Do Outside the Code

This guide walks you through all the AWS and GitHub setup needed to make your CI/CD workflow work.

## 📋 Prerequisites Checklist

### ✅ 1. AWS Account Setup

#### 1.1 Create AWS Account (if you don't have one)
- Go to [aws.amazon.com](https://aws.amazon.com)
- Sign up for an account
- Complete verification

#### 1.2 Create IAM User for GitHub Actions
**Why:** GitHub Actions needs AWS credentials to deploy

**Steps:**
1. Go to AWS Console → IAM → Users → Create User
2. Name: `github-actions-deployer`
3. Select: "Programmatic access" (Access key)
4. Attach policies:
   - `AmazonEC2ContainerRegistryFullAccess` (for ECR)
   - `AmazonECS_FullAccess` (for ECS)
   - `AmazonElasticFileSystemFullAccess` (for EFS)
   - `SecretsManagerReadWrite` (for secrets)
5. **Save the Access Key ID and Secret Access Key** - you'll need them for GitHub Secrets

**⚠️ Important:** Store these credentials securely. You won't see the secret key again!

---

### ✅ 2. Create ECR Repositories

**ECR = Elastic Container Registry** (where Docker images are stored)

You need 3 repositories:

```bash
# Using AWS CLI (recommended) or AWS Console
aws ecr create-repository --repository-name fidesinnova_iot_server/backend --region us-east-2
aws ecr create-repository --repository-name fidesinnova_iot_server/user_webapp --region us-east-2
aws ecr create-repository --repository-name fidesinnova_iot_server/admin_webapp --region us-east-2
```

**Or via AWS Console:**
1. Go to ECR → Repositories → Create repository
2. Create each repository:
   - `fidesinnova_iot_server/backend`
   - `fidesinnova_iot_server/user_webapp`
   - `fidesinnova_iot_server/admin_webapp`
3. Region: `us-east-2`
4. Leave other settings as default

---

### ✅ 3. Create ECS Cluster

**ECS = Elastic Container Service** (where containers run)

**Steps:**
1. Go to ECS → Clusters → Create Cluster
2. Cluster name: `fidesinnova_iot_server/ecs_cluster`
3. Infrastructure: **AWS Fargate** (serverless, no EC2 to manage)
4. Region: `us-east-2`
5. Create cluster

---

### ✅ 4. Create IAM Roles for ECS Tasks

You need 2 IAM roles:

#### 4.1 ECS Task Execution Role
**Purpose:** Allows ECS to pull images from ECR and write logs

**Steps:**
1. Go to IAM → Roles → Create Role
2. Trusted entity: **ECS Tasks**
3. Use case: **ECS Task**
4. Attach policies:
   - `AmazonECSTaskExecutionRolePolicy`
   - `AmazonElasticFileSystemClientReadWriteAccess` (for EFS)
   - `SecretsManagerReadWrite` (for secrets)
5. Role name: `ecsTaskExecutionRole`
6. Create role

#### 4.2 ECS Task Role (Optional but recommended)
**Purpose:** Allows your application to access AWS services

**Steps:**
1. Go to IAM → Roles → Create Role
2. Trusted entity: **ECS Tasks**
3. Use case: **ECS Task**
4. Attach policies based on what your app needs:
   - S3 access (if needed)
   - DynamoDB access (if needed)
   - Other AWS services your app uses
5. Role name: `ecsTaskRole`
6. Create role

**Note:** Your `backend.json` references `ecsTaskRole` - make sure it exists!

---

### ✅ 5. Create EFS File System

**EFS = Elastic File System** (shared storage for containers)

**Steps:**
1. Go to EFS → File systems → Create file system
2. Name: `fidesinnova-iot-server-efs`
3. VPC: Select your VPC (or create one)
4. Availability zones: Select at least 2
5. Performance mode: General Purpose
6. Throughput mode: Bursting
7. Create file system
8. **Save the File System ID** (starts with `fs-`)

#### 5.1 Create EFS Access Points

You need 5 access points (for different mount points):

**For each access point:**
1. Go to your EFS → Access points → Create access point
2. Create these access points:

   **a) SSL Certificates:**
   - Name: `ssl-certs-access-point`
   - Path: `/ssl-certs`
   - POSIX user: `1000:1000`
   - Permissions: `755`
   - **Save Access Point ID**

   **b) App Data:**
   - Name: `app-data-access-point`
   - Path: `/app-data`
   - POSIX user: `1000:1000`
   - Permissions: `755`
   - **Save Access Point ID**

   **c) MongoDB Data:**
   - Name: `mongo-data-access-point`
   - Path: `/mongo-data`
   - POSIX user: `999:999` (MongoDB user)
   - Permissions: `755`
   - **Save Access Point ID**

   **d) MongoDB Init:**
   - Name: `mongo-init-access-point`
   - Path: `/mongo-init`
   - POSIX user: `999:999`
   - Permissions: `755`
   - **Save Access Point ID**

   **e) Uploads/Logs (if needed):**
   - Create additional access points as needed

---

### ✅ 6. Create CloudWatch Log Groups

**Purpose:** Store container logs

**Steps:**
1. Go to CloudWatch → Log groups → Create log group
2. Create these log groups:
   - `/ecs/backend`
   - `/ecs/webapp`
   - `/ecs/admin-webapp`
3. Retention: 7-30 days (your choice)
4. Create each log group

---

### ✅ 7. Create AWS Secrets (if using Secrets Manager)

**If your task definitions use AWS Secrets Manager:**

**Steps:**
1. Go to Secrets Manager → Store a new secret
2. Create secrets for each service:

   **Backend:**
   - `backend/mongo-uri`
   - `backend/mongo-user`
   - `backend/mongo-password`

   **WebApp:**
   - `webapp/api-key`

   **Admin WebApp:**
   - `admin/api-key`

3. Store as plaintext or key-value pairs
4. **Note:** Make sure your task execution role has permission to read these

---

### ✅ 8. Create ECS Task Definitions

**Important:** Your workflow uses task definitions from `.aws/*.json` files, but you need to register them first in ECS.

**Steps:**
1. Go to ECS → Task definitions → Create new task definition
2. For each service (backend, webapp, admin-webapp):
   - Upload your JSON file from `.aws/` folder
   - **BUT FIRST:** Replace all `{{PLACEHOLDERS}}` with actual values:
     - `{{AWS_ACCOUNT_ID}}` → Your AWS account ID
     - `{{AWS_REGION}}` → `us-east-2`
     - `{{ECR_REGISTRY}}` → Your ECR registry URL (e.g., `123456789012.dkr.ecr.us-east-2.amazonaws.com`)
     - `{{EFS_ID}}` → Your EFS file system ID
     - `{{EFS_*_ACCESS_POINT}}` → Your access point IDs
   - Register task definition

**Or use AWS CLI:**
```bash
# After replacing placeholders in the JSON files
aws ecs register-task-definition --cli-input-json file://.aws/backend.json --region us-east-2
aws ecs register-task-definition --cli-input-json file://.aws/webapp.json --region us-east-2
aws ecs register-task-definition --cli-input-json file://.aws/admin-webapp.json --region us-east-2
```

---

### ✅ 9. Create ECS Services

**Steps:**
1. Go to ECS → Clusters → Your cluster → Services → Create
2. For each service:

   **Backend Service:**
   - Launch type: **Fargate**
   - Task definition: `backend-task` (latest revision)
   - Service name: `fidesinnova_iot_server/backend`
   - Number of tasks: `1` (or more for high availability)
   - VPC: Your VPC
   - Subnets: Select at least 2 subnets
   - Security groups: Create/select appropriate security group
   - Auto-assign public IP: **ENABLED** (if no NAT gateway)
   - Load balancer: Optional (recommended for production)
   - Create service

   **Repeat for:**
   - `fidesinnova_iot_server/user_webapp`
   - `fidesinnova_iot_server/admin_webapp`

---

### ✅ 10. GitHub Repository Setup

#### 10.1 Add GitHub Secrets

**Steps:**
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions → New repository secret
3. Add these secrets:

   ```
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   EFS_FILE_SYSTEM_ID
   EFS_SSL_ACCESS_POINT
   EFS_DATA_ACCESS_POINT
   EFS_MONGO_DATA_ACCESS_POINT
   EFS_MONGO_INIT_ACCESS_POINT
   ```

4. Use the values you saved from earlier steps

#### 10.2 Create Production Environment (Optional but recommended)

**Steps:**
1. Go to Settings → Environments → New environment
2. Name: `production`
3. Add protection rules (optional):
   - Required reviewers
   - Wait timer
4. Save environment

---

### ✅ 11. Network Setup (VPC, Subnets, Security Groups)

#### 11.1 VPC and Subnets
- Ensure you have a VPC with at least 2 subnets in different AZs
- Subnets should have internet access (or NAT gateway)

#### 11.2 Security Groups
Create security groups for your services:

**Backend Security Group:**
- Inbound: Port 3000 (or your backend port) from ALB/Internet
- Outbound: All traffic

**WebApp/Admin Security Group:**
- Inbound: Port 80 from ALB/Internet
- Outbound: All traffic

**EFS Security Group:**
- Inbound: NFS (2049) from your ECS security groups
- Outbound: All traffic

---

### ✅ 12. Test the Workflow

#### 12.1 First Test
1. Make a small change to your code
2. Commit and push to `main` branch
3. Go to Actions tab → Watch the workflow run
4. Check for errors and fix them

#### 12.2 Verify Deployment
1. Check ECR: Images should appear in repositories
2. Check ECS: Services should update with new tasks
3. Check CloudWatch: Logs should appear
4. Test your application endpoints

---

## 🔍 Verification Checklist

Before your first deployment, verify:

- [ ] AWS IAM user created with correct permissions
- [ ] 3 ECR repositories created
- [ ] ECS cluster created
- [ ] IAM roles created (`ecsTaskExecutionRole`, `ecsTaskRole`)
- [ ] EFS file system created
- [ ] 5 EFS access points created
- [ ] CloudWatch log groups created
- [ ] AWS Secrets created (if using)
- [ ] ECS task definitions registered
- [ ] ECS services created
- [ ] VPC and subnets configured
- [ ] Security groups configured
- [ ] GitHub secrets added
- [ ] Production environment created (optional)

---

## 🚨 Common Issues & Solutions

### Issue: "Access Denied" errors
**Solution:** Check IAM user permissions and roles

### Issue: "Repository not found" in ECR
**Solution:** Verify repository names match exactly (case-sensitive)

### Issue: "Task definition not found"
**Solution:** Register task definitions first, or check family names

### Issue: "EFS mount failed"
**Solution:** 
- Check security group allows NFS (port 2049)
- Verify access point IDs are correct
- Check EFS is in same VPC as ECS tasks

### Issue: "Image pull failed"
**Solution:**
- Verify ECR repository exists
- Check task execution role has ECR permissions
- Verify image was pushed successfully

---

## 📚 Useful AWS CLI Commands

```bash
# Get your AWS Account ID
aws sts get-caller-identity --query Account --output text

# Get ECR registry URL
aws ecr describe-repositories --region us-east-2

# Check ECS services
aws ecs list-services --cluster fidesinnova_iot_server/ecs_cluster --region us-east-2

# View task definition
aws ecs describe-task-definition --task-definition backend-task --region us-east-2

# Check EFS file systems
aws efs describe-file-systems --region us-east-2

# View CloudWatch logs
aws logs tail /ecs/backend --follow --region us-east-2
```

---

## 🎯 Next Steps After Setup

1. **Monitor first deployment** - Watch logs and metrics
2. **Set up alerts** - CloudWatch alarms for failures
3. **Configure load balancer** - For production traffic
4. **Set up domain/DNS** - Point to your services
5. **Enable auto-scaling** - Based on CPU/memory
6. **Set up backup strategy** - For EFS and databases

---

## 💡 Pro Tips

1. **Start small** - Test with one service first
2. **Use AWS Console** - Easier for beginners than CLI
3. **Save all IDs** - Keep a document with all resource IDs
4. **Test in staging** - Create a staging environment first
5. **Monitor costs** - Fargate and EFS can get expensive
6. **Use tags** - Tag all resources for better organization

---

**Need help?** Check AWS documentation or GitHub Actions logs for detailed error messages.

