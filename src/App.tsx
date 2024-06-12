import { faCheck, faFilter, faMagnifyingGlass, faPencil, faRectangleXmark, faRotate, faSortDown, faSortUp, faUserPen, faXmark } from '@fortawesome/free-solid-svg-icons'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useState } from 'react'
import { TableComponent } from './components/TableComponent'

function App() {
  const [header, setHeader] = useState([{ name: "Header 1", sort: true }, { name: "Header 2", sort: true }, { name: "Header 3", sort: true }, { name: "Header 4", sort: true }, { name: "Header 5", sort: true }, { name: "Header 6", sort: true }, { name: "Header 7", sort: true }]);
  // const [sortDirection, setSortDirection] = useState(true);
  return (
    <>
      <h1>Vite + React</h1>
      <TableComponent></TableComponent>
    </>
  )
}

export default App
