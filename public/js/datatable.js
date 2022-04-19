function initDatatable(id, scrollY = 550) {
    $(id).DataTable({
        dom: 'Blfrtip',
        order: [0,'desc'],
        "scrollY": scrollY,
        "scrollX": true,
        buttons: ['excel','copy', {
            extend: 'pdf',
            orientation: 'landscape',
            pageSize: 'A3'}],
        alignement: 'center',
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/French.json'
        }
    });
}