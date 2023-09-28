/*********************************************************************************
*  WEB422 – Assignment 2
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Panchanok Kaewchinda Student ID: 145443214 Date: Sep 27,2023
*
********************************************************************************/ 

let page = 1; // Current page
const perPage = 10; // Items per page

function loadCompanyData(tag = null){

    const apiEndpoint = tag ? `/api/companies?page=${page}&perPage=${perPage}&tag=${tag}`
        : `/api/companies?page=${page}&perPage=${perPage}`;
    
    fetch(apiEndpoint)
        .then((res) => res.json())
        .then((data) => {
            // Check if tag is not null to hide pagination
            if (tag) {
                document.querySelector('.pagination').classList.add('d-none');
                page = 1;
            } else {
                document.querySelector('.pagination').classList.remove('d-none');
            }

            const tableBody = document.querySelector('#companiesTable tbody');
            tableBody.innerHTML = data.map(companyObjectToTableRowTemplate).join('');

            // Update the "Current Page"
            document.querySelector('#current-page').textContent = page;

            // Add click events to the table rows
            document.querySelectorAll('#companiesTable tbody tr').forEach((row) => {
                row.addEventListener('click', () => {
                    const companyId = row.getAttribute('data-id');
            
                    fetch(`/api/company/${companyId}`)
                        .then((response) => response.json())
                        .then((companyData) => {
                            document.querySelector('.modal-title').textContent = companyData.name;
            
                            document.querySelector('.modal-body').innerHTML = `
                                <strong>Category:</strong> ${companyData.category_code || 'n/a'}<br /><br />
                                <strong>Description:</strong> ${companyData.description || 'n/a'}<br /><br />
                                <strong>Overview:</strong> ${companyData.overview || 'n/a'}<br />
                                ${companyData.tag_list ? `<strong>Tag List:</strong><br />${companyData.tag_list.split(', ').map(tag => tag ? `• ${tag}` : '').join('<br />')}<br /><br />` : ''}
                                <strong>Founded:</strong> ${new Date(companyData.founded_year, companyData.founded_month - 1, companyData.founded_day).toDateString() || 'n/a'}<br /><br />
                                <strong>Key People:</strong> ${getFounderNames(companyData.relationships) || 'n/a'}<br /><br />
                                <strong>Products:</strong><br />
                                ${companyData.products.length ? companyData.products.map(products => `• ${products.name}`).join('<br />') : 'n/a'}<br /><br />
                                <strong>Number of Employees:</strong> ${companyData.number_of_employees || 'n/a'}<br /><br />
                                <strong>Website:</strong> <a href="${companyData.homepage_url || 'n/a'}" target="_blank">${companyData.homepage_url || 'n/a'}</a><br /><br />
                            `;

                            const modal = new bootstrap.Modal(document.getElementById("detailsModal"), {
                                backdrop: "static",
                                keyboard: false
                            });
                            modal.show();
                        })
                        .catch((error) => {
                            console.error('Error fetching company details:', error);
                        });
                });
            });
        })
        .catch((error) => {
            console.error('Error fetching company data:', error);
        });
}

// Get founder names
function getFounderNames(relationships) {
    const founders = relationships.filter((relationship) => relationship.title.includes('Founder'));
    return founders.map((founder) => founder.person.first_name + ' ' + founder.person.last_name).join(', ');
}

// Convert a company object to a table row template
const companyObjectToTableRowTemplate = (companyObj) => {
    return `
        <tr data-id="${companyObj.name}">
            <td>${companyObj.name || '--'}</td>
            <td>${companyObj.category_code || '--'}</td>
            <td>${companyObj.description || '--'}</td>
            <td>${companyObj.founded_month}/${companyObj.founded_day}/${companyObj.founded_year || '--'}</td>
            <td>${getFounderNames(companyObj.relationships) || '--'}</td>
            <td>${companyObj.offices[0]?.city}, ${companyObj.offices[0]?.state_code}, ${companyObj.offices[0]?.country_code || '--'}</td>
            <td>${companyObj.number_of_employees || '--'}</td>
            <td>${companyObj.tag_list?.split(', ').slice(0, 2).join(', ') || '--'}</td>
            <td><a href="${companyObj.homepage_url}" target="_blank">${companyObj.homepage_url || '--'}</a></td>
        </tr>
    `;
};

document.addEventListener("DOMContentLoaded", function () {
    // Click event for the previous page
    document.querySelector("#previous-page").addEventListener("click", function () {
        if (page > 1) {
            page--;
            loadCompanyData();
        }
    });

    // Click event for the next page
    document.querySelector("#next-page").addEventListener("click", function () {
        page++;
        loadCompanyData();
    });

    // Submit event for the searchForm
    document.querySelector("#searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const tagField = document.querySelector("#tag");
        loadCompanyData(tagField.value);
    });

    // Click event for the clearForm
    document.querySelector("#clearForm").addEventListener("click", function () {
        const tagField = document.querySelector("#tag");
        tagField.value = "";
        loadCompanyData();
    });

    loadCompanyData();
});

