import { Link } from 'react-router'
import { useDocumentTitle } from '../lib/useDocumentTitle'
import { PageIntro } from '../components/Bits'
import { ClearMenu, countLabel, EmptyMenu, MenuList } from '../components/MenuControls'
import { useShortlist } from '../lib/shortlist'

export default function MyMenu() {
  const ids = useShortlist()
  useDocumentTitle('My menu')
  return (
    <>
      <PageIntro title="My menu">
        <p>The dishes you’ve chosen to talk about. Only this list is kept on this device, so it is still here when you come back. It is not an order, and nothing here has a price.</p>
      </PageIntro>
      <div className="container section section--top-tight my-menu" data-menu-scope>
        <h2 className="my-menu__title" tabIndex={-1} data-menu-fallback>{countLabel(ids.length)} chosen</h2>
        {ids.length ? (
          <>
            <MenuList />
            <div className="my-menu__actions">
              <Link to="/quote" className="button button--primary">Continue to quote</Link>
              <Link to="/menus" className="button button--outline">Add more dishes</Link>
              <ClearMenu />
            </div>
          </>
        ) : (
          <>
            <EmptyMenu />
            <ClearMenu />
          </>
        )}
        <p className="fine-print">Your choices are stored in this browser only, as a list of dish codes. No names, contact details or dietary notes are saved.</p>
      </div>
    </>
  )
}
