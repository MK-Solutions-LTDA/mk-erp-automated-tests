import { URL } from "../../../../../Setup";

export const API = {
    NOVA_FATURA: `${URL}/mk/WSMKCPNovaFatura.rule?`,
    LIQUIDAR_FATURA: `${URL}/mk/WSMKCPLiquidarFatura.rule?`,
    LIQUIDAR_FATURA_MASSA: `${URL}/mk/WSMKCPLiquidarFaturasMassa.rule?`,
    ESTORNAR_FATURA: `${URL}/mk/WSMKCPEstornarFatura.rule?`,
    SUSPENDER_FATURA: `${URL}/mk/WSMKCPFaturaSuspensao.rule?`,
    SUSPENDER_FATURA_MASSA: `${URL}/mk/WSMKCPFaturaSuspensaoMassa.rule?`,
    REMOVER_SUSPENSAO_FATURA: `${URL}/mk/WSMKCPFaturaRemoverSuspencao.rule?`,
    REMOVER_SUSPENSAO_FATURA_MASSA: `${URL}/mk/WSMKCPFaturaRemoverSuspensaoMassa.rule?`,
    EXCLUIR_FATURA: `${URL}/mk/WSMKCPFaturaExclusao.rule?`,
    INSERIR_ANEXO_FATURA: `${URL}/mk/WSMKCPFaturaInserirAnexo.rule?`,
    NOVO_PARCELAMENTO: `${URL}/mk/WSMKCPNovoParcelamento.rule?`,
    FATURAS: `${URL}/mk/WSMKCPFaturas.rule?`,
    INFO_CARDS: `${URL}/mk/WSMKCPCardsInfoFaturas.rule??`,
}