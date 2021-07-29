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

module.exports={
    organizeKey: organizefn
}