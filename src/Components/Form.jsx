import React, { useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import Data from "../Data";

// Sample API response data
const apiResponse = Data;

// Validation schema for Formik
const validationSchema = Yup.object({
  taxName: Yup.string().required('Required'),
  taxPercentage: Yup.number().required('Required').min(0).max(100),
  applyTo: Yup.string().required('Required'),
});

const TaxForm = () => {
  const [groupedItems, setGroupedItems] = useState({});

  useEffect(() => {
    // Group items by category
    const grouped = apiResponse.reduce((acc, item) => {
      const category = item.category ? item.category.name : 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});
    setGroupedItems(grouped);
  }, []);

  const handleSubmit = (values) => {
    const selectedItems = Object.entries(values.items)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    const appliedTo = values.applyTo === 'all' ? 'all' : 'some';
    console.log({ applied_to: appliedTo, applicable_items: selectedItems });
  };

  const handleApply = (values) => {
    const selectedItems = Object.entries(values.items)
      .filter(([key, value]) => value)
      .map(([key]) => key);
    const appliedTo = values.applyTo === 'all' ? 'all' : 'some';
    console.log('Apply Action:', { applied_to: appliedTo, applicable_items: selectedItems });
  };

  const handleAnotherAction = (values) => {
    console.log('Another Action Triggered:', values);
  };

  const handleCategoryChange = (category, setFieldValue, isChecked) => {
    const itemsInCategory = groupedItems[category].map((item) => item.id);
    itemsInCategory.forEach((itemId) => {
      setFieldValue(`items.${itemId}`, isChecked);
    });
  };

  return (
    <Formik
      initialValues={{
        taxName: '',
        taxPercentage: '',
        applyTo: 'specific',
        search: '',
        items: {},
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form style={{ width: '400px', margin: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1>Add Tax</h1>
            <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>X</button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <Field name="taxName" type="text" placeholder="Tax Name" style={{ width: '60%' }} />
            <Field name="taxPercentage" type="number" placeholder="Tax %" style={{ width: '40%' }} />
            <span style={{ position: "absolute", right: "490px" }}>%</span>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Field type="radio" name="applyTo" value="all" id="applyAll" />
            <label htmlFor="applyAll">Apply to all items in collection</label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Field type="radio" name="applyTo" value="specific" id="applySpecific" />
            <label htmlFor="applySpecific">Apply to specific items</label>
          </div>
          <div style={{ marginTop: '10px' }}>
            <Field name="search" type="text" placeholder="Search Items" style={{ width: '100%' }} />
          </div>

          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} style={{ marginTop: '10px', padding: '10px' }}>
              <Field
                type="checkbox"
                name={`categories.${category}`}
                onClick={(e) => handleCategoryChange(category, setFieldValue, e.target.checked)}
              />
              <label>{category}</label>
              {items.map((item) => (
                <div key={item.id} style={{ marginTop: '10px' }}>
                  <Field type="checkbox" name={`items.${item.id}`} />
                  <label>{item.name}</label>
                </div>
              ))}
            </div>
          ))}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button type="button" style={{ marginTop: '20px', background: "blue", color: "White" }} onClick={() => handleApply(values)}>Apply</button>
            <button type="button" style={{ marginTop: '20px', background: "Yellow", color: "White" }} onClick={() => handleAnotherAction(values)}>Another Action</button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default TaxForm;
