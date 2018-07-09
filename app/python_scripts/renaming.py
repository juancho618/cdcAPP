import sys

import pandas as pd
import numpy as np
import os
import glob
import shutil
import json
import re



#Function to extract just the number from an ID.
def getNumberID (text):
    containsOrgan = 'organ' in text
    reLetters = re.compile('[A-Z]{2}_[0-9A-Z]+');
    hasVAT = reLetters.search(text)
    
    if hasVAT:        
        country, num = hasVAT.group(0).split('_') 
        return num
    else:
        return False


# Gets the current directory path
dirpath = os.getcwd()


#Renaming source path
source_directory = sys.argv[1]
variableNameList = sys.argv[2]
variableNameList= json.loads(variableNameList)
# Go to the directory where all the pdf files to be renamed are found
os.chdir(r'{}'.format(source_directory))
pdfList = [item for item in glob.glob('*.pdf') ]

# Loads the trucks matrix as a dataframe
df = pd.read_excel(dirpath + '/app/data/trucksMatrix.xlsm')


# Create list with name, VAT and assignor number
name = df['company_name'].tolist()
vatList = df['Ident'].tolist()
assnr = df['Assignor_Number'].tolist()

# Function that gets the assignor position in the matrix and creates the name structure.
def new_name_format (position, var_list):
    new_document_name = ""
    for variable in var_list:
        if variable['isVar'] == True:
            new_document_name += df.loc[position, variable['name']]
        else:
            new_document_name += variable['name']
    new_document_name += '.pdf'
    return new_document_name
        

# Get creates two list of the documents that could be renamed and the documents that does not contains any VAT number
documents_wo_id = []
documents_tobe_renamed = []
documents_wo_vat_match = []
for i in range(len(pdfList)):
    id_number = getNumberID(pdfList[i])
    if id_number:
        documents_tobe_renamed.append({'id': id_number, 'name': pdfList[i] })
    else:
        documents_wo_id.append(pdfList[i]) 



# For every element that has to be renamed will searc for the match in the VAT
for doc in documents_tobe_renamed:
    for i, vat in enumerate(vatList):
        if doc['id'] in vat:           
            doc['position'] = i
            new_name = new_name_format(i, variableNameList )
            print(doc['name'], new_name)
            shutil.copyfile('{0}/{1}'.format(source_directory, doc['name']),'{0}/results/{1}'.format(source_directory,new_name))
        else:
            documents_wo_vat_match.append(doc)
documents_tobe_renamed = list(filter(lambda doc :  'position' in doc, documents_tobe_renamed ))

#create the structure of the new name
# listWithRenamedNames=[]
# for i, vatList in enumerate(vatList):
#     pass
# for i in range(0,len(name)):
#     outputName=str(int(assnr[i]))+'-' + str(name[i]) + '_' + str(vat[i]) + '_' + 'sinv.pdf'
#     listWithRenamedNames.append(outputName)



# # main part where the renaming happens
# for i in range(0,len(pdfList)):
#     for j in range(0,len(vat)):
#         if vat[j] in pdfList[i]:
#             for k in range(0, len(listWithRenamedNames)):
#                 if vat[j] in listWithRenamedNames[k]:
#                     shutil.move('{}'.format(pdfList[i]),'{}'.format(listWithRenamedNames[k]))




# print('renaming completed')

sys.stdout.flush()