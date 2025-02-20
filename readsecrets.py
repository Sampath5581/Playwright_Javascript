import os

from dotenv import load_dotenv, dotenv_values

 

import os

import boto3

import json

import base64

from botocore.exceptions import ClientError

from io import StringIO

import csv

import hvac

from hvac.exceptions import InvalidPath, Forbidden

import logging

 

logging.getLogger().setLevel(logging.INFO)

logging.basicConfig(format='%(asctime)s - %(message)s',datefmt='%m/%d/%Y %I:%M:%S %p', level=logging.INFO)

 

#load_dotenv()

#config = dotenv_values(".env")

#print('config',config)

# OPENAI_API_KEY = secrets["openai_api_key")

# OPENAI_DEPLOYMENT_ENDPOINT = secrets["openai_api_base")

# OPENAI_DEPLOYMENT_NAME = secrets["deployment_name")

# OPENAI_MODEL_NAME = secrets["OPENAI_MODEL_NAME")

# OPENAI_DEPLOYMENT_VERSION = secrets["openai_api_version")

# OPENAI_API_type=secrets["openai_api_type")

# embedmodelname=secrets["OPENAI_EMBED_MODEL")

# embeddeployname=secrets["OPENAI_EMBED_DEPLOY")

# promptResponseTemperature = secrets["temperature")

# promptResponseTokens = secrets["max_tokens")

def load_secrets():

    VAULT_URL = 'https://lockbox.gcso.cbre.com'#secrets['VAULT_URL')  # constant - no need to change it / set it within pipeline variables unless something changes with HV configuration in the future

    VAULT_HEADER = 'lockbox.gcso.cbre.com'#secrets['VAULT_HEADER')  # constant - same as above

    VAULT_ROLE = 'globalpulse-nonprod-iam'#secrets['VAULT_ROLE')   # name of role used by GCSO in terraform scripts; for PMDM: nonprod: globalpropertymanagementbi-nonprod-iam; prod: globalpropertymanagementbi-prod-iam

                                                                                    # those roles are linked via IAM roles linked to EC2 machines for agents located within PMDM envs - please make sure correct agent is referenced!

    VAULT_MOUNT_POINT = 'globalpulse/rec/kv'#secrets['VAULT_MOUNT_POINT')  # name of PMDM mount point: one of four (from lowest to highest env): globalpropertymanagementbi/sandbox/kv , globalpropertymanagementbi/dev/kv/ , globalpropertymanagementbi/staging/kv/ , globalpropertymanagementbi/prod/kv/

    VAULT_FOLDER = 'playwright'#secrets['VAULT_FOLDER')  # name of the folder (or structure of folders) within the mount point. For example if secret 'test' is located in the folder 'test_folder', this pipeline variable should be set to 'test_folder' so that code below 'prepares' secret_name = 'test_folder/test'.

                                                    # if there were two levels of folders, for example 'test_folder' and then 'project1', this variable should be set to 'test_folder/project1' so that we get secret_name = 'test_folder/project1/test'

 

    try:

        client = hvac.Client(url=VAULT_URL)

        session = boto3.Session()

        credentials = session.get_credentials()

 

        client.auth.aws.iam_login(credentials.access_key, credentials.secret_key, session_token=credentials.token, role=VAULT_ROLE, header_value=VAULT_HEADER)

        read_response = client.secrets.kv.v2.read_secret_version(path=VAULT_FOLDER, mount_point=VAULT_MOUNT_POINT, raise_on_deleted_version=True)

        secret = read_response['data']['data']

        logging.info(f'Successfully retrieved credentials from HashiCorp Vault secrets manager. Role: {VAULT_ROLE} mount point: {VAULT_MOUNT_POINT}')

        return secret

    except Exception as e:

        logging.exception(f'Error retrieving credentials from HashiCorp Vault secrets manager. Role: {VAULT_ROLE}, mount point: {VAULT_MOUNT_POINT} --> {e}')

        raise e

print('calling secrets')

secrets = load_secrets()

AUTOMATION_USERID1 = secrets["aut_admin_uid"]

AUTOMATION_PASSWORD1 = secrets["aut_admin_pwd"]

 

print(AUTOMATION_USERID1)

print(AUTOMATION_PASSWORD1)

print(f"##vso[task.setvariable variable=aut_admin_uid]{AUTOMATION_USERID1}")

print(f"##vso[task.setvariable variable=aut_admin_pwd]{AUTOMATION_PASSWORD1}")