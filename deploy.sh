#!/bin/bash
npm run build && scp -r dist/* root@sv:/var/www/storyboard/
