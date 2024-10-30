export default class Servicos {

  static async checarRequisicao(
    response: any
  ): Promise<{ sucesso: string }> {
    const jsonResponse = await response?.json();
  
    console.log("Resposta JSON:", jsonResponse);
  
    if (response.ok()) {
      console.log(jsonResponse)
      return { sucesso: jsonResponse };
    } else {
      return { sucesso: jsonResponse };
    }
  }
}