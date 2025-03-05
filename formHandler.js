// Function to submit form data using fetch and handle the response
async function submitHybridForm(formId, callback) {
    const form = document.querySelector(`form#${formId}`);
    if (!form) {
      console.error(`Form with id "${formId}" not found.`);
      return;
    }
  
    const formData = new FormData(form);
  
    // Include CSV content from any csv-textarea elements in the form
    form.querySelectorAll('csv-textarea').forEach(csvTextarea => {
      formData.append(csvTextarea.getAttribute('name'), csvTextarea.innerHTML);
    });
  
    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });
  
      if (response.ok) {
        callback(response);
      } else {
        console.error(`Form submission failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  }
  