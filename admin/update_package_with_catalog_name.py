import ckan.logic as logic
import ckan.model as model
import requests
from sqlalchemy import create_engine
from ConfigParser import ConfigParser
from argparse import ArgumentParser
import json

ValidationError = logic.ValidationError

config = ConfigParser()
parser = ArgumentParser()
parser.add_argument(
    '-c', '--config', help='Config file',
    type=lambda name: config.read([name]), required=True
)

parser.add_argument(
    '-k', '--key', help='Api Key', required=True
)
args = parser.parse_args()
engine = create_engine(config.get('app:main', 'sqlalchemy.url'))
model.init_model(engine)

HOST = config.get('app:main', 'ckan.site_url')
API_KEY = args.key

datasets = requests.get(
    HOST + '/api/3/action/package_search?fq=&rows=1000',
    verify=False,
    headers={
        'Authorization': API_KEY,
        'Content-type': 'application/json'
    }).json()

print("{0} datasets found".format(datasets['result']['count']))

for idx, data in enumerate(datasets['result']['results']):
    if 'layer_id' in data:
        data['layer_list_name'] = data['layer_id']
        data.pop('layer_id')
    if 'layer_catalog_name' not in data:
        data['layer_catalog_name'] = 'SEED_catalog'
    try:
        print("{0}. Updating dataset {1}.".format(idx, data['name']))
        r = requests.post(
            HOST + '/api/3/action/package_update',
            verify=False,
            data=json.dumps(data),
            headers={
                'Authorization': API_KEY,
                'Content-type': 'application/json'
            }).json()
        if r['success']:
            print("{0}. Dataset: {1} has been updated.".format(idx, data['name']))
        else:
            print("{0}. Dataset: {1} is not updated.".format(idx, data['name']))
    except Exception as e:
            print type(e), e
