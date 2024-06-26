import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AssetState } from "../../../utils/Enum";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faClose, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  CategoryCreateModel,
  CategoryModel,
} from "../../../models/CategoryModel";
import useSWR from "swr";
import {
  categoriesEndpoint,
  createCategories,
  getCategories,
} from "../../../services/CategoryService";
import { message } from "antd";
import { AssetCreateModel } from "../../../models/AssetModel";
import { createAsset } from "../../../services/AssetService";
import { AssetForTableModel } from "../../../models/AssetForTableModel";

const assetValidationSchema = Yup.object({
  assetName: Yup.string()
    .max(100, "Asset name must be at most 100 characters")
    .required("Asset name is required"),
  categoryName: Yup.string()
    // .max(100, 'Last name must be at most 128 characters')
    .required("Category is required"),
  specification: Yup.string()
    .max(300, "Specification must be at most 300 characters")
    .required("Specification is required"),
  installedDate: Yup.date()
    .max(new Date(), "Installed date must be from the current date or earlier")
    .required("Installed date is required"),
});

export const CreateAssetComponent = () => {
  const [loading, setLoading] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: categoriesResponse, mutate: mutateCategories } = useSWR(
    categoriesEndpoint,
    getCategories
  );

  const formik = useFormik({
    initialValues: {
      assetName: "",
      categoryName: "",
      specification: "",
      installedDate: "",
      assetState: AssetState.AVAILABLE,
    },
    validationSchema: assetValidationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const data: AssetCreateModel = {
        assetName: values.assetName,
        categoryName: values.categoryName,
        specification: values.specification,
        installDate: values.installedDate,
        assetState: values.assetState.toUpperCase(),
      };

      await createAsset(data)
        .then((response) => {
          message.success(response.data.message);
          const newAsset: AssetForTableModel = response.data.data;
          setLoading(false);
          navigate("/admin/manage-assets", {
            replace: true,
            state: { newAsset: newAsset },
          });
        })
        .catch((error) => {
          message.error(error.response.data.message);
          setLoading(false);
        });
    },
  });

  const categoryFormik = useFormik<CategoryCreateModel>({
    initialValues: {
      name: "",
      prefix: "",
    },
    onSubmit: async (values) => {
      await createCategories(values)
        .then((response) => {
          message.success(response.data.message);
          mutateCategories();
          categoryFormik.resetForm();
        })
        .catch((error) => {
          message.error(error.response.data.message);
        });
    },
  });

  const toggleDropdown = (isShow: boolean) => {
    setShowDropdown(isShow);
    if (!isShow) {
      setAddCategory(false);
      categoryFormik.resetForm();
    }
  };

  const handleCategoryChange = (category: CategoryModel) => {
    formik.setFieldValue("categoryName", category.name);
    toggleDropdown(false);
  };

  return (
    <div>
      <Container>
        <Form
          className="p-5"
          style={{ maxWidth: "60%", minWidth: "300px", textAlign: "left" }}
          onSubmit={formik.handleSubmit}
        >
          <h4 style={{ color: ColorPalette.PRIMARY_COLOR }} className="mb-4">
            Create New Asset
          </h4>
          <Form.Group as={Row} className="mb-3" controlId="assetName">
            <Form.Label column sm={3}>
              Name
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="text"
                {...formik.getFieldProps("assetName")}
              />
              {formik.touched.assetName && formik.errors.assetName ? (
                <div className="error-message">{formik.errors.assetName}</div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="categoryName">
            <Form.Label column sm={3}>
              Category
            </Form.Label>
            <Col sm={9}>
              <Dropdown
                show={showDropdown}
                onToggle={toggleDropdown}
                autoClose="outside"
              >
                <Dropdown.Toggle
                  variant="outline-dark"
                  id="dropdown-custom-2"
                  className="form-select"
                  style={{ height: "39px" }}
                >
                  {formik.values.categoryName}
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    width: "100%",
                    background: ColorPalette.SLIVER_100_COLOR,
                  }}
                  className="border-dark"
                >
                  {categoriesResponse?.data.data.map(
                    (category: CategoryModel) => (
                      <Dropdown.Item
                        key={category.id}
                        onClick={() => {
                          handleCategoryChange(category);
                        }}
                      >
                        {category.name}
                      </Dropdown.Item>
                    )
                  )}
                  <Dropdown.Divider className="border-dark" />
                  <Dropdown.Item id="add-category-dropdown-item">
                    {addCategory ? (
                      <Form.Group
                        className="d-flex"
                        controlId="newCategoryName"
                      >
                        <Col sm={7}>
                          <Form.Control
                            type="text"
                            placeholder="New Category Name"
                            className="rounded-0"
                            style={{ height: "30px" }}
                            id="newCategoryName"
                            maxLength={100}
                            {...categoryFormik.getFieldProps("name")}
                          />
                        </Col>
                        <Col sm={3}>
                          <Form.Control
                            type="text"
                            placeholder="PF"
                            className="rounded-0"
                            style={{ height: "30px" }}
                            maxLength={2}
                            id="newCategoryPrefix"
                            {...categoryFormik.getFieldProps("prefix")}
                          />
                        </Col>
                        <Col className="d-flex ps-2">
                          <Col className="d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon
                              size="lg"
                              icon={faCheck}
                              onClick={() =>
                                categoryFormik.dirty
                                  ? categoryFormik.handleSubmit()
                                  : null
                              }
                              color={
                                categoryFormik.dirty
                                  ? ColorPalette.PRIMARY_COLOR
                                  : ColorPalette.SLIVER_400_COLOR
                              }
                            />
                          </Col>
                          <Col className="d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon
                              size="lg"
                              icon={faClose}
                              onClick={() => {
                                toggleDropdown(false);
                              }}
                            />
                          </Col>
                        </Col>
                      </Form.Group>
                    ) : (
                      <div
                        className="btn-link text-danger"
                        onClick={() => setAddCategory(true)}
                      >
                        <i>Add New Category</i>
                      </div>
                    )}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              {formik.touched.categoryName && formik.errors.categoryName ? (
                <div className="error-message">
                  {formik.errors.categoryName}
                </div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="specification">
            <Form.Label column sm={3}>
              Specification
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                as="textarea"
                rows={4}
                {...formik.getFieldProps("specification")}
              />
              {formik.touched.specification && formik.errors.specification ? (
                <div className="error-message">
                  {formik.errors.specification}
                </div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="installedDate">
            <Form.Label column sm={3}>
              Installed Date
            </Form.Label>
            <Col sm={9}>
              <Form.Control
                type="date"
                {...formik.getFieldProps("installedDate")}
              />
              {formik.touched.installedDate && formik.errors.installedDate ? (
                <div className="error-message">
                  {formik.errors.installedDate}
                </div>
              ) : null}
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="assetState">
            <Form.Label column sm={3}>
              State
            </Form.Label>
            <Col sm={9} id="assetState" className="red-border-on-focus">
              <Form.Check
                label={AssetState.AVAILABLE}
                name="assetState"
                value={AssetState.AVAILABLE}
                type="radio"
                id={AssetState.AVAILABLE}
                className="me-5"
                defaultChecked={true}
                onChange={formik.handleChange}
              />
              <Form.Check
                label={AssetState.NOT_AVAILABLE}
                name="assetState"
                value={AssetState.NOT_AVAILABLE}
                type="radio"
                id={AssetState.NOT_AVAILABLE}
                onChange={formik.handleChange}
              />
            </Col>
          </Form.Group>
          <Row>
            <Col className="d-flex justify-content-end my-4">
              <Button
                variant="danger"
                className="mx-4"
                style={{ minWidth: "100px" }}
                type="submit"
                disabled={!formik.dirty || !formik.isValid || loading}
              >
                {" "}
                {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Save"}
              </Button>
              <Button
                variant="outline-dark"
                className="ms-4"
                style={{ minWidth: "100px" }}
                onClick={() => {
                  navigate(-1);
                }}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  );
};
