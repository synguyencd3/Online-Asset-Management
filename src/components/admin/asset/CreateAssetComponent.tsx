import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { ColorPalette } from "../../../utils/ColorPalette";
import * as Yup from "yup";
import { useFormik } from "formik";
import { AssetState } from "../../../utils/Enum";
import { useEffect, useState } from "react";
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
import { AssetCreateModel, AssetForTableModel } from "../../../models/AssetModel";
import { createAsset } from "../../../services/AssetService";

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

type Props = {
  setHeaderTitle: any;
};

export const CreateAssetComponent = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const [loadingCreateCategory, setLoadingCreateCategory] = useState(false);
  const [addCategory, setAddCategory] = useState(false);
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const { data: categoriesResponse, mutate: mutateCategories } = useSWR(
    categoriesEndpoint,
    getCategories
  );

  useEffect(() => {
    props.setHeaderTitle("Manage Asset > Create Asset");
  }, []);

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
        assetState: values.assetState.toUpperCase().replace(/ /g, "_"),
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
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(100, "Category name must be at most 100 characters")
        .required("Category name is required"),
    }),
    onSubmit: async (values) => {
      if (!categoryFormik.isValid) return;
      setLoadingCreateCategory(true);
      await createCategories(values)
        .then((response) => {
          setLoadingCreateCategory(false);
          message.success(response.data.message);
          mutateCategories();
          categoryFormik.resetForm();
        })
        .catch((error) => {
          message.error(error.response.data.message);
          setLoadingCreateCategory(false);
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
                  className="w-100 pe-0"
                  style={{ height: "39px" }}
                >
                  <input
                    type="text"
                    className="w-100 border-0 h-100 form-select ps-0 py-0"
                    id="dropdown-toggle-text"
                    readOnly
                    {...formik.getFieldProps("categoryName")}
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  style={{
                    width: "100%",
                    background: ColorPalette.SLIVER_100_COLOR,
                  }}
                  className="border-dark"
                >
                  <div style={{ minWidth: "fit-content"}}>
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
                  </div>
                  <div id="add-category-dropdown-item" className="px-3">
                    {addCategory ? (
                      <Form.Group className="d-flex">
                        <Col sm={10}>
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
                        <Col className="d-flex ps-2">
                          <Col className="d-flex align-items-center justify-content-center">
                            {loadingCreateCategory ? (
                              <FontAwesomeIcon
                                size="lg"
                                icon={faSpinner}
                                spin
                                color={ColorPalette.PRIMARY_COLOR}
                              />
                            ) : (
                              <FontAwesomeIcon
                                size="lg"
                                icon={faCheck}
                                onClick={() =>
                                  categoryFormik.dirty && categoryFormik.isValid
                                    ? categoryFormik.handleSubmit()
                                    : null
                                }
                                color={
                                  categoryFormik.dirty && categoryFormik.isValid
                                    ? ColorPalette.PRIMARY_COLOR
                                    : ColorPalette.SLIVER_400_COLOR
                                }
                              />
                            )}
                          </Col>
                          <Col className="d-flex align-items-center justify-content-center">
                            <FontAwesomeIcon
                              size="lg"
                              icon={faClose}
                              onClick={() => {
                                setAddCategory(false);
                                categoryFormik.resetForm();
                              }}
                            />
                          </Col>
                        </Col>
                      </Form.Group>
                    ) : (
                      <div
                        className="btn-link text-danger"
                        onClick={() => setAddCategory(true)}
                        style={{ cursor: "pointer" }}
                      >
                        <i>Add New Category</i>
                      </div>
                    )}
                  </div>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
              <span className='mx-1' style={{ color: ColorPalette.PRIMARY_COLOR }}>*</span>
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
