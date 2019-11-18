

//DB에 발송 할 수있는 row 가 있는 지 확인 후 발송
const getMessage = () => {
    let rowDataId;
    $.ajax({
        url: "/crawling/dbselect",
        type: "GET",
        dataType: "json",
        success: function(result){
            console.log(result);

            if(typeof result[0] == "undefined"){
                alert("전송 할 메시지가 없습니다.");
                return;
            }
            rowDataId = result[0].id;
            
            $.ajax({
                url: "/pushSend",
                type: "GET",
                dataType: "json",
                data: {body: result[0].message},
                success: function(result){
                    console.log(result);
                    UpdateDB(rowDataId);
                }
            });
        }
    });
}

//DB에서 발송 완료한 컬럼에 대하여 발송완료 처리
const UpdateDB = (rowDataId) =>{
    $.ajax({
        url: "/crawling/update",
        type: "POST",
        dataType: "json",
        data: {id: rowDataId},
        success: function(result){
            console.log(result);
            alert("메시지가 발송되었습니다.");
        }
    });
}

//DB에 PUSH 메시지 입력
const InsertDB = (msg) => {
    $.ajax({
        url: '/crawling/insert',
        dataType: 'json',
        type: 'POST',
        data: {key: "push" ,message: msg},
        success: function(result) {
            if (result) {
                console.log(result.msg);
                alert("저장완료");
            }
        }
    });
    return true;
}