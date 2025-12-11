export const useFiles = () => {
  const handleCSVReader = (event: Event): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (!file) {
        reject("No file selected");
        return;
      }

      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        const contents = e.target?.result as string;
        const lines = contents.split("\n");
        const data = lines.map((line) => line.split(",").map((cell) => cell.trim().replace(/(\r\n|\n|\r)/gm, "")));
        resolve(data);
      };

      reader.onerror = () => {
        reject(reader.error);
      };

      reader.readAsText(file);
    });
  };

  return {
    handleCSVReader,
  };
};
