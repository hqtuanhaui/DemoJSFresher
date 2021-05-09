// Base xử lý liên quan tới grid
class BaseGrid {
    constructor(gridId){
        let me = this;

        // Lưu lại grid
        me.grid = $(gridId);

        // Lấy dữ liệu từ server
        me.getDataServer();

        // Khởi tạo các sự kiện
        me.initEvents();
    }

    /**
     * Hàm dùng để khơi tạo các sự kiện trên trang
     * CreatedBy: NTXUAN 06.05.2021
     */
    initEvents(){
        let me = this;
    }

    /**
     * Hàm lấy dữ liệu từ server xong binding lên grid
     * CreatedBy: NTXUAN 06.05.2021
     */
    getDataServer(){
        let me = this,
            url = me.grid.attr("Url"),
            urlFull = `${Constant.UrlPrefix}${url}`;

        // Gọi ajax lấy dữ liệu trên server
        CommonFn.Ajax(urlFull, Resource.Method.Get, {}, function(response){
            if(response){
                me.loadData(response);
            }else{
                console.log("Có lỗi khi lấy dữ liệu từ server");
            }
        });
    }

     /**
     * Hàm dùng để binding dữ liệu ra grid
     * CreatedBy: NTXUAN 06.05.2021
     */
    loadData(data){
        let me = this,
            table = $("<table></table>"),
            thead = me.renderThead(),
            tbody = me.renderTbody(data);
    
            table.append(thead);
            table.append(tbody);
    
        me.grid.html("");
        me.grid.append(table);
    }

     /**
     * Hàm dùng để Render ra header của grid
     * CreatedBy: NTXUAN 06.05.2021
     */
    renderThead(){
        let me = this,
            thead = $("<thead></thead>"),
            row = $("<tr></tr>");
    
        // Duyệt toàn bộ các cột để lấy thông tin build header
        me.grid.find(".col").each(function(){
            let text = $(this).text(),
                th = $("<th></th>");
    
            th.text(text);
            row.append(th);
        });
    
        thead.append(row);
    
        return thead;
    }

     /**
     * Hàm dùng để Render ra nội dung grid
     * CreatedBy: NTXUAN 06.05.2021
     */
    renderTbody(data){
        let me = this,
            tbody = $("<tbody></tbody>");
    
        // Duyệt từng phần tử để build các row
        data.filter(function(item){
            let row = $("<tr></tr>");
    
            // Duyệt từng cột trên grid để lấy ra thông tin các cột
            me.grid.find(".col").each(function(){
                let column = $(this),
                    fieldName = column.attr("FieldName"),
                    dataType = column.attr("DataType"),
                    cell = $("<td></td>"),
                    valueCell = item[fieldName],
                    className = me.getClassFormat(dataType),
                    value = me.getValue(valueCell, dataType, column);
                
                cell.text(value);
                cell.addClass(className);
                row.append(cell);
            });
    
            tbody.append(row);
        });
    
        return tbody;
    }

    /**
     * Hàm dùng để lấy value các cell dựa vào DataType
     * CreatedBy: NTXUAN 06.05.2021
     */
    getValue(data, dataType, column){

        switch(dataType){
            case Resource.DataTypeColumn.Number:
                data = CommonFn.formatMoney(data);
                break;
            case Resource.DataTypeColumn.Date:
                data = CommonFn.formatDate(data);
                break;
            case Resource.DataTypeColumn.Enum:
                let enumName = column.attr("EnumName");
                data = CommonFn.getValueEnum(data, enumName);
                break;
        }
    
        return data;
    }

     /**
     * Hàm dùng để lấy class format cho từng kiểu dữ liệu
     * CreatedBy: NTXUAN 06.05.2021
     */
    getClassFormat(dataType){
        let className = "";
    
        switch(dataType){
            case Resource.DataTypeColumn.Number:
                className = "align-right";
                break;
            case Resource.DataTypeColumn.Date:
                className = "align-center";
                break;
        }
    
        return className;
    }
}
