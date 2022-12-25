#!/bin/sh

node index.js 2>&1 | tee -a /var/log/app-$(echo $HOSTNAME).log