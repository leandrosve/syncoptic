const readJsonFile = (file?: File):Promise<any | undefined> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    if (file) fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      try {
        const result = e?.target?.result?.toString() || "{}";
        resolve(JSON.parse(result) || {});
      } catch (error) {
       resolve({}) 
      }
       
     
    };
  });
};

export default readJsonFile;