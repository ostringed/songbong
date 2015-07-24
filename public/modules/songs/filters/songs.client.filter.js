angular.module('appFilters', []).filter("sanitize", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsHtml(htmlCode);
    }
}]).filter("sanitizeURL", ['$sce', function($sce) {
    return function(htmlCode){
        return $sce.trustAsResourceUrl(htmlCode);
    }
}])