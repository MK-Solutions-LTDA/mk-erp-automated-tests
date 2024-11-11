export default class Servicos {
  static async checarRequisicao(response: any): Promise<{ sucesso: any }> {
    const contentType = response.headers()["content-type"] || "";

    if (response.ok() && contentType.includes("application/json")) {
      const jsonResponse = await response.json();
      console.log("Resposta JSON:", jsonResponse);
      return { sucesso: jsonResponse };
    } else {
      const responseText = await response.text();
      console.error("Erro na requisição:", response.status());
      console.error("Resposta do servidor:", responseText);
      return { sucesso: "false" };
    }
  }
}