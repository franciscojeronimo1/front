export const MENU_FILTER_EVENT = 'menu:select-filter'

export type MenuFilterTarget = 'todas' | 'esfihas'

/** Pede ao cardápio para trocar o filtro e rolar até os itens. */
export function selectMenuFilter(filter: MenuFilterTarget) {
  window.dispatchEvent(new CustomEvent<MenuFilterTarget>(MENU_FILTER_EVENT, { detail: filter }))
}
