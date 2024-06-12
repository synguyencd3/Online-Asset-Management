import React from 'react'
import { TableComponent } from '../TableComponent'

export const SideBarComponent: React.FC = () => {
  return (
    <div className="container pb-3 flex-grow-1 d-flex flex-column overflow-auto">
      <div className="row flex-grow-sm-1 flex-grow-0">
        <aside className="col-sm-3 flex-grow-sm-1 flex-shrink-1 flex-grow-0 sticky-top pb-sm-0 pb-3">
          <div className="bg-light border rounded-3 p-1 h-100 sticky-top">
            <ul className="nav nav-pills flex-sm-column flex-row mb-auto justify-content-between text-truncate">
              <li className="nav-item">
                <a href="#" className="nav-link px-2 text-truncate">
                  <i className="bi bi-house fs-5"></i>
                  <span className="d-none d-sm-inline">Home</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-truncate">
                  <i className="bi bi-speedometer fs-5"></i>
                  <span className="d-none d-sm-inline">Manage User</span>
                </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-card-text fs-5"></i>
                  <span className="d-none d-sm-inline">Manage Asset</span> </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-bricks fs-5"></i>
                  <span className="d-none d-sm-inline">Manage Assignment</span> </a>
              </li>
              <li>
                <a href="#" className="nav-link px-2 text-truncate"><i className="bi bi-people fs-5"></i>
                  <span className="d-none d-sm-inline">Request for Returning</span> </a>
              </li>
            </ul>
          </div>
        </aside>
        <main className="col overflow-auto h-100">
          <div className="bg-light border rounded-3 p-3">
            <TableComponent />
          </div>
        </main>
      </div>
    </div>
  )
}
