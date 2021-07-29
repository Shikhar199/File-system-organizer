#!/usr/bin/env node
let fs = require("fs");
let helpObj = require("./commands/help");
let organizeObj = require("./commands/organize");
let treeObj = require("./commands/tree");
const process = require("process");
let path = require("path");

let inputArr = process.argv.slice(2);
//console.log(inputArr);

let command = inputArr[0];

let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}

switch(command)
{
    case "tree":  treeObj.treeKey(inputArr[1]);
                  break;

    case "organize": organizeObj.organizeKey(inputArr[1]);
                     break;

    case "help" : helpObj.helpKey();
                  break;

    default: console.log("please input right command");
}

function treefn(dirpath)
{
    let destpath;
    if(dirpath==undefined)
    {
        treehelper(process.cwd(),"");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirpath);
        if(doesExist)
        {
            treehelper(dirpath,"");
        }
        else{
            console.log("kndly enter the path");
            return;
        }
    }
}

function treehelper(dirpath,indent)
{
    let isFile = fs.lstatSync(dirpath).isFile();
    if(isFile==true)
    {
        let fileName = path.basename(dirpath);
        console.log(indent + "├──" + fileName);
    }
    else{
        let dirName = path.basename(dirpath);
        console.log(indent + "└──" + dirName);
        let children = fs.readdirSync(dirpath);
        for(let i=0;i<children.length;i++)
        {
            let childPath = path.join(dirpath,children[i]);
            treehelper(childPath,indent+"\t");
        }
    }
}

function organizefn(dirpath)
{
    let destpath;
    if(dirpath==undefined)
    {
        destpath=process.cwd();
        return;
    }
    else{
        let doesExist = fs.existsSync(dirpath);
        if(doesExist)
        {
            destpath = path.join(dirpath,"organized_files");
            if(fs.existsSync(destpath)==false)
            {
                fs.mkdirSync(destpath);
            }
        }
        else{
            console.log("kndly enter the path");
            return;
        }
    }
    organizeHelper(dirpath,destpath);
}

function organizeHelper(src,dest)
{
    let childNames = fs.readdirSync(src);

    for(let i=0;i<childNames.length;i++)
    {
        let childPath = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childPath).isFile();
        if(isFile)
        {
            let category = getCategory(childNames[i]);   //extension lake dega file ki

            sendFiles(childPath,dest,category);
        }
    }

}

function sendFiles(srcFilePath,dest,category)
{
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath)==false)
    {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath,fileName);
    fs.copyFileSync(srcFilePath,destFilePath);                 //copy files to destination
    fs.unlinkSync(srcFilePath);                                //copy files and remove original files
}

function getCategory(name)
{
    let ext = path.extname(name);
    ext = ext.slice(1);
    for(let type in types)
    {
        let ctypeArray = types[type];
        for(let i= 0;i<ctypeArray.length;i++)
        {
            if(ext==ctypeArray[i])
            {
                return type;
            }
        }
    }
    return "others";
}

function helpfn()
{
    console.log(`
    List of All the commands:
                 node main.js tree "directoryPath"
                node main.js organize "directoryPath"
                node main.js help
                `);
}