import os
import glob
import re

files = glob.glob('src/app/api/**/*.ts', recursive=True)

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Replace args: [userId]
    content = content.replace('args: [userId]', 'args: [userId.toString()]')
    # Replace args: [siswaId, userId]
    content = content.replace('args: [siswaId, userId]', 'args: [siswaId, userId.toString()]')
    # Replace user_id: userId
    content = content.replace('body.user_id = userId;', 'body.user_id = userId.toString();')
    
    with open(f, 'w') as file:
        file.write(content)
