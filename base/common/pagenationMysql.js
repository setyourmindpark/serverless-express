exports.initialize = initialize;

// 해당 모듈을 n 개생성할수있도록 초기화하여 생성함. pagenation 초기값에따라 로직이달라질수있음. 
// 이곳에 환경변수설정시 기본적으로 caching되기에 필요할때마다 object 생성함
function initialize(recordCountPerPage = 10, pageSize = 10) {
    if (typeof (recordCountPerPage) === 'string') recordCountPerPage = parseInt(recordCountPerPage);
    if (typeof (pageSize) === 'string') pageSize = parseInt(pageSize);

    function getStartIndex(pageNo) {
        return (pageNo - 1) * recordCountPerPage + 1;
    }

    function getEndIndex(pageNo, totalRecordCount) {
        return totalRecordCount > getStartIndex(pageNo) + recordCountPerPage - 1
            ? getStartIndex(pageNo) + recordCountPerPage - 1
            : totalRecordCount;
    };

    return {
        getQueryIndex: (pageNo) => {
            if (typeof (pageNo) === 'string') pageNo = parseInt(pageNo);

            return {
                start: (pageNo - 1) * recordCountPerPage,
                end: recordCountPerPage
            }
        },
        getPagenationInfo: (pageNo, totalRecordCount) => {
            if (typeof (pageNo) === 'string') pageNo = parseInt(pageNo);
            if (typeof (totalRecordCount) === 'string') pageSize = parseInt(totalRecordCount);

            function getTotalPageCount() {
                return Math.floor(((totalRecordCount - 1) / recordCountPerPage)) + 1;
            }

            function getFirstPageNoOnPageList() {
                return (Math.floor((pageNo - 1) / pageSize)) * pageSize + 1;
            }

            function getLastPageNoOnPageList() {
                let lastPageNoOnPageList = getFirstPageNoOnPageList() + pageSize - 1;
                if (lastPageNoOnPageList > getTotalPageCount()) {
                    lastPageNoOnPageList = getTotalPageCount();
                }
                return lastPageNoOnPageList;
            }

            if (getTotalPageCount() < pageNo) return undefined;

            return {
                start: getStartIndex(pageNo).toString(),
                end: getEndIndex(pageNo, totalRecordCount).toString(),
                totalRecordCount: totalRecordCount.toString(),
                pageNo: pageNo.toString(),
                totalPageCount: getTotalPageCount().toString(),
                firstPageNoOnPageList: getFirstPageNoOnPageList().toString(),
                lastPageNoOnPageList: getLastPageNoOnPageList().toString()
            }
        }
    }
}
