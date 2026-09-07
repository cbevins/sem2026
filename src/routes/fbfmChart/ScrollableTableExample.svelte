<script>
    import ScrollableTable from './ScrollableTable.svelte'
    
    let table = $state({
        cols: [{
            key: 'name',
            headers: ['Primary', 'User Name'],
            css: 'p-2 text-gray-900 text-left font-medium',
        },{
            key: 'salary',
            headers: ['Salary'],
            css: 'p-2 text-green-900 text-right',
        },{
            key: 'email',
            css: 'p-2 text-blue-900 text-center',
            headers: ['Contact', 'Email Address'],
        },{
            key: 'role',
            css: 'p-2 text-blue-900 text-center',
            headers: ['System Role', 'Permissions'],
        },{
            key: 'dept',
            css: 'p-2 text-blue-900 text-center',
            headers: ['Corporate', 'Department'],
        },{
            key: 'status',
            headers: ['Current', 'Status'],
            css: "p-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        },],
        idKey: 'id',    // any prop key that is unique to each data item
        data: [
            { id: 1, name: 'Alex Johnson', salary: 1, email: 'alex.johnson@company.com', role: 'System Administrator', dept: 'Engineering Operations', status: 'Active' },
            { id: 2, name: 'Jane Smith', salary: 12, email: 'jane.smith@company.com', role: 'Content Lead Editor', dept: 'Global Marketing', status: 'Active' },
            { id: 3, name: 'Bob Cordell', salary: 123, email: 'bob.cordell@company.com', role: 'Support Specialist', dept: 'Customer Success', status: 'Inactive' },
            { id: 4, name: 'Alice Wong', salary: 1234, email: 'alice.wong@company.com', role: 'Database Engineer', dept: 'Infrastructure Systems', status: 'Active' },
            { id: 5, name: 'Charlie Day', salary: 12345, email: 'charlie.day@company.com', role: 'Operations Specialist', dept: 'Logistics Team', status: 'Active' },
            { id: 6, name: 'Diana Prince', salary: 123456, email: 'diana.prince@company.com', role: 'General Counsel', dept: 'Legal & Compliance', status: 'Active' },
            { id: 7, name: 'Evan Wright', salary: 1234567, email: 'evan.wright@company.com', role: 'Security Analyst', dept: 'Infrastructure Systems', status: 'Active' },
        ],
    })
</script>

<ScrollableTable {table}/>