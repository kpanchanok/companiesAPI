// Variables
let page = 1; // Current page
const perPage = 10; // Items per page

// Function to load company data
function loadCompanyData(tag = null){
    // Determine the API endpoint based on the tag parameter
    const apiEndpoint = tag ? `/api/companies?page=${page}&perPage=${perPage}&tag=${tag}`
        : `/api/companies?page=${page}&perPage=${perPage}`;
    
    // Fetch data from the API
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

            // Transform the data and add it to the table
            const tableBody = document.querySelector('#companiesTable tbody');
            tableBody.innerHTML = data.map(companyObjectToTableRowTemplate).join('');

            // Update the "Current Page"
            document.querySelector('#current-page').textContent = page;

            // Add click events to the table rows
            const tableRows = document.querySelectorAll('#companiesTable tbody tr');
            tableRows.forEach((row) => {
                row.addEventListener('click', () => {
                    const companyId = row.getAttribute('data-id');
                    // Make a request to get company details using the companyId
                    fetch(`/api/company/${companyId}`)
                        .then((response) => response.json())
                        .then((companyData) => {
                            // Populate the modal with company details
                            const modalTitle = document.querySelector('.modal-title');
                            modalTitle.textContent = companyData.name;

                            const modalBody = document.querySelector('.modal-body');
                            modalBody.innerHTML = `
                                <strong>Category:</strong> ${companyData.category_code}<br /><br />
                                <strong>Description:</strong> ${companyData.description}<br /><br />
                                <strong>Overview:</strong> ${companyData.overview}<br /><br />
                                <strong>Tag List:</strong> ${companyData.tag_list}<br /><br />
                                <strong>Founded:</strong> ${companyData.founded_month}/${companyData.founded_day}/${companyData.founded_year}<br /><br />
                                <strong>Key People:</strong> ${getFounderNames(companyData.relationships)}<br /><br />
                                <strong>Products:</strong> ${companyData.products}<br /><br />
                                <strong>Number of Employees:</strong> ${companyData.number_of_employees}<br /><br />
                                <strong>Website:</strong> <a href="${companyData.homepage_url}" target="_blank">${companyData.homepage_url}</a><br /><br />
                            `;

                            // Show the modal
                            $('#detailsModal').modal('show');
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

// Helper function to get founder names
function getFounderNames(relationships) {
    const founders = relationships.filter((relationship) => relationship.title.includes('Founder'));
    return founders.map((founder) => founder.person.first_name + ' ' + founder.person.last_name).join(', ');
}

// Helper function to convert a company object to a table row template
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
    // Click event for the "previous page" pagination button
    document.querySelector("#previous-page").addEventListener("click", function () {
        if (page > 1) {
            page--;
            loadCompanyData();
        }
    });

    // Click event for the "next page" pagination button
    document.querySelector("#next-page").addEventListener("click", function () {
        page++;
        loadCompanyData();
    });

    // Submit event for the "searchForm" form
    document.querySelector("#searchForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const tagField = document.querySelector("#tag");
        loadCompanyData(tagField.value);
    });

    // Click event for the "clearForm" button
    document.querySelector("#clearForm").addEventListener("click", function () {
        const tagField = document.querySelector("#tag");
        tagField.value = "";
        loadCompanyData();
    });

    // Initial data load when the page loads
    loadCompanyData();
});

