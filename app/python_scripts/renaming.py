import sys

import pandas as pd
import numpy as np
import os
import glob
import shutil
import json

# Gets the current directory path
dirpath = os.getcwd()


#Renaming source path
source_directory = sys.argv[1]
variableNameList = sys.argv[2]
data = json.loads(variableNameList)
print(data[0]['name'])
# Go to the directory where all the pdf files to be renamed are found
os.chdir(r'{}'.format(source_directory))
pdfList = [item for item in glob.glob('*.pdf') ]

# Loads the trucks matrix as a dataframe
df = pd.read_excel(dirpath + '/app/data/trucksMatrix.xlsm')


# Create list with name, VAT and assignor number
name = df['company_name'].tolist()
vat = df['Ident'].tolist()
assnr = df['Assignor_Number'].tolist()



#create the structure of the new name
listWithRenamedNames=[]
for i in range(0,len(name)):
    outputName=str(int(assnr[i]))+'-' + str(name[i]) + '_' + str(vat[i]) + '_' + 'sinv.pdf'
    listWithRenamedNames.append(outputName)



# # main part where the renaming happens
# for i in range(0,len(pdfList)):
#     for j in range(0,len(vat)):
#         if vat[j] in pdfList[i]:
#             for k in range(0, len(listWithRenamedNames)):
#                 if vat[j] in listWithRenamedNames[k]:
#                     shutil.move('{}'.format(pdfList[i]),'{}'.format(listWithRenamedNames[k]))




# print('renaming completed')

sys.stdout.flush()