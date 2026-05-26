import os
import glob

files = glob.glob('src/app/api/**/*.ts', recursive=True)

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    if 'getServerSession' in content:
        if 'authOptions' not in content:
            content = content.replace('import { getServerSession } from "next-auth/next";', 'import { getServerSession } from "next-auth/next";\nimport { authOptions } from "@/app/api/auth/[...nextauth]/route";')
            content = content.replace("import { getServerSession } from 'next-auth/next';", "import { getServerSession } from 'next-auth/next';\nimport { authOptions } from '@/app/api/auth/[...nextauth]/route';")
        content = content.replace('getServerSession()', 'getServerSession(authOptions)')
        with open(f, 'w') as file:
            file.write(content)
