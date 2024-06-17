import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

type Props = {
    placeholder: string | null
}
// function name() {
//     "url" + "?sort=sort,order";

// }
export const SearchComponent = ({ placeholder }: Props) => {
    // const [search, setSearch] = useState();
    return (
        <InputGroup className="" style={{ maxWidth: "300px" }}>
            <Form.Control
                placeholder={placeholder ?? "Search"}
            />
            <Button variant="outline-dark" id="button-addon1" onClick={(e) => { console.log(e) }}>
                <FontAwesomeIcon size='lg' icon={faMagnifyingGlass} />

            </Button>
        </InputGroup>
    );
}
