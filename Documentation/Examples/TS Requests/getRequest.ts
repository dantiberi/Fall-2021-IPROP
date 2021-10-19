import fetch from "node-fetch";

  async function apiGetQuestion(id:number): Promise<any> {
      var url = "https://jebrafunctions.azurewebsites.net/api/GetQuestion?code=KoWO/aWjlpHbXBep0eePd39TA1uwcTXjYQxMIOaHDgrTwTKkBT3S2g==&id="+id;
      const response = await fetch(url);
      const body = await response.json();
      return body;
  }

  async function main(){
      const data = await apiGetQuestion(83)
  }

  main();