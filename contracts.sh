#!/bin/bash -e

export ENV=$1
if [ "$DEPLOYMENT" == "prod" ]; then
  SERVER=hume.brightblock.org;
  BUILDER=build-prod
fi

printf "\n====================================================================== \n";
printf "Info: Testnet \n";
curl -X GET https://stacks-node-api.regtest.stacks.co/v2/info

printf "\n====================================================================== \n";
printf "Info: Xenon \n";
curl -X GET https://stacks-node-api.xenon.blockstack.org/v2/info

printf "\n====================================================================== \n";
printf "Info: localhost \n";
curl -X GET http://localhost:20443/v2/info

printf "\n====================================================================== \n";
printf "Contract lookup localhost: STCRTBG84RSA93H9N01A9R794DB0EZQQ3G74A8SA.appmap \n";
curl -X GET http://localhost:20443/v2/contracts/source/STCRTBG84RSA93H9N01A9R794DB0EZQQ3G74A8SA/appmap?proof=0

printf "\n====================================================================== \n";
printf "Contract lookup localhost: STCRTBG84RSA93H9N01A9R794DB0EZQQ3G74A8SA.appmap \n";
curl -X GET http://localhost:20443/v2/contracts/source/STCRTBG84RSA93H9N01A9R794DB0EZQQ3G74A8SA/appmap?proof=0

printf "\n====================================================================== \n";

exit 0;
