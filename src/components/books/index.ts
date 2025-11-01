/**
 * Books Components - Könyv olvasó komponensek exportálása
 *
 * Ez a fájl exportálja a különböző könyv olvasó komponenseket.
 *
 * HASZNÁLAT:
 *
 * import { StandaloneBookView, PenzugyiAlapismeretkBookView } from './components/books';
 *
 * vagy
 *
 * import { StandaloneBookView } from './components/books/StandaloneBookView';
 */

export { StandaloneBookView } from './StandaloneBookView';
export type { StandaloneBookViewProps, BookViewTerm } from './StandaloneBookView';

export { PenzugyiAlapismeretkBookView } from './PenzugyiAlapismeretkBookView';
export default PenzugyiAlapismeretkBookView;
