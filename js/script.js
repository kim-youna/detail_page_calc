$(document).ready(function () {
    $("#crush").change(function () {
        var $sel = $(this).val();
        $(".result_opt1").text($sel);
    });
    $("#gram").change(function () {
        var $sel = $(this).val();
        $(".result_opt2").text($sel);
    });

    var $str_price = $(".det_price span").text();
    var $num_price = parseFloat($str_price.replace(",", ""));
    var $total = 0; //총 금액의 숫자형 데이터
    var $final_total = ""; // 총 금액의 문자형 데이터
    var $each_price = 0; //각 선택 박스의 금액
    var $each_calc_price = []; //각 아이템 별로 1개 단위마다 기본값(대기값) (배열데이터)
    var $amount = []; //각 아이템 별 수량(배열 데이터)
    var $each_total_price = []; //각 아이템 별로 최종값 (배열데이터)

    $(".total_price_num span").text($total); //초기의 총금액


    var $each_box = `
    <li class="my_item">
        <div class="det_count">
            <div class="det_count_tit">
                <p class="opt_01">원두(분쇄없음)</p>
                <p class="opt_02">200g</p>
            </div>
            <div class="det_count_bx">
                <a class="minus" href="#">－</a>
                <input type="text" value="1" readonly>
                <a class="plus" href="#">＋</a>
            </div>
            <div class="det_count_price"><span class="each_price">14,000</span>원</div>
            <div class="item_del"><span>×</span></div>
        </div>
    </li>
    `;

    //
    $(".det_total_price").hide();
    $("select#crush option:eq(0), select#gram option:eq(0)").prop("selected" ,true);  //최초 로딩시  -필수 항목-을 표기한다.

    function calc_price(){
        //각 항목에 대한 추가
        $total = 0; //값이 추가되는 부분을 막아야함
        for (i = 0; i < $each_total_price.length; i++) {
            $total += $each_total_price[i]; //최종 배열 데이터 내부의 모든 값을 더한다.
        }
        if($total == 0){   //전체 합산이0 이라면
            $(".det_total_price").hide();   
            $("select option").prop("selected" ,false);  //전체를 모두 선택을 해제한다.
            $("select#crush option:eq(0),select#gram option:eq(0)").prop("selected" ,true);  //선택을 필수항목으로 변경한다
        }else{
            $(".det_total_price").show(); 
        }

        $final_total = $total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".total_price_num span").text($final_total); //총 금액 표기
    }
    
    $(document).on("click",".item_del",function(){
        var $del_index = $(this).closest("li").index();
        $each_total_price.splice($del_index, 1);   //해당하는 index번호의 데이터를 삭제하고 나머지는 저장
        $each_calc_price.splice($del_index, 1);
        $amount.splice($del_index, 1);

        console.log($each_total_price);
        console.log($each_calc_price);
        console.log($amount);

        $(this).closest("li").remove();

        calc_price();

    });







    //조건 1번 : 셀렉트 박스가 먼저 선택이 된 상태 후,  2번 셀렉트 박스가 선택이 되었을 때 change 이벤트를 걸어 각 세부항목인 .my_item을 ul아래의 마지막 자식에 추가
    $(".form_crush select").change(function(){
        $(".form_gram select").removeAttr("disabled");
    });


    $(".form_gram select").change(function () {
        $(".opt_box").append($each_box);

        var $opt_01 = $("#crush option:selected").text();
        console.log("나의 첫번째 선택 :" + $opt_01);
        var $opt_02 = $("#gram option:selected").text();
        console.log("나의 두번째 선택:" + $opt_02);
        var $opt_02_val = parseFloat($(".form_gram select").val());
        console.log("나의 두번째 선택 value값은 :" + $opt_02_val);

        $(".opt_box li:last .opt_01").text($opt_01);
        $(".opt_box li:last .opt_02").text($opt_02);

        $present_price = $num_price + $opt_02_val;
        console.log("선택을 마친 기본가 + 옵션가 :" + $present_price);

        $each_total_price.push($present_price);
        console.log($each_total_price); //옵션가를 포함한 가격을 배열데이터로 저장(변동됨)

        $each_calc_price.push($present_price);
        console.log($each_calc_price); //내부에서 + 또는 -버튼을 클릭시 수량과 함께 계산해야 할 데이터 (고정)

        $amount.push(1);
        console.log($amount); //초기수량을 넣어줘야됨

        var $result_opt = $present_price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".each_price").text($result_opt);
        calc_price();
    });

    /* 수량체크  */

    /* 각 아이템 박스의 +를 클릭시 */
    $(document).on("click", ".minus", function () {
        var $index = $(this).closest("li").index();
        if ($amount[$index] != 1) {
            $amount[$index]--; //수량 감소
            console.log($amount);
            $(this).siblings("input").val($amount[$index]); //감소 수량을 표기

            $each_total_price[$index] = $each_calc_price[$index] * $amount[$index]; //최종 배열데이터 = 기본값 * 수량
            console.log($each_total_price);
            console.log($each_calc_price);

            var $result_price = $each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $(this).closest(".det_count_bx").siblings(".det_count_price").find(".each_price").text($result_price);

        }
        calc_price();
        return false;

    });

    /* 각 아이템 박스의 +를 클릭시 */
    $(document).on("click", ".plus", function () {
        var $index = $(this).closest("li").index();
        $amount[$index]++;
        console.log($amount[$index]);
        console.log($amount);

        $(this).siblings("input").val($amount[$index]);
        $each_total_price[$index] = $each_calc_price[$index] * $amount[$index];
        console.log($each_total_price);
        console.log($each_calc_price);

        var $result_price = $each_total_price[$index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(this).closest(".det_count_bx").siblings(".det_count_price").find(".each_price").text($result_price);
        
        calc_price();

        return false;
    });

























































});