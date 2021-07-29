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

module.exports={
    treeKey: treefn
}