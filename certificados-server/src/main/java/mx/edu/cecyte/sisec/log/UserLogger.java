package mx.edu.cecyte.sisec.log;

import mx.edu.cecyte.sisec.dto.catalogs.CatalogScope;
import mx.edu.cecyte.sisec.dto.user.GroupData;
import mx.edu.cecyte.sisec.dto.user.ListGroupData;
import mx.edu.cecyte.sisec.dto.user.UserData;
import mx.edu.cecyte.sisec.dto.user.scopeData;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.apache.log4j.Logger;

public class UserLogger {

    public static void adminSearch( Logger log, String message, UserSession userSession, Integer adminType) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("adminSearch");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". AdminType: ").append(adminType);
        log.error(error);
    }

    public static void editUser(Logger log, String message, UserSession userSession, UserData userData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editUser");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(userData);
        log.error(error);
    }

    public static void addNewUser(Logger log, String message, UserSession userSession, UserData userData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewUser");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(userData);
        log.error(error);
    }

    public static void editUserPassword(Logger log, String message, UserSession userSession, UserData password) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editUserPassword");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". Password: ").append(password.getPassword());
        log.error(error);
    }

    public static void addGroup( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void findByGroup( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("findByGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void updateGroup( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updateGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void deleteGroup( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void addPermission( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("permissionGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void findByPermission( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("findByPermission");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void updatePermission( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updatePermission");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void deletePermission( Logger log, String message, UserSession userSession, GroupData groupData) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deletePermission");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void findByPermissionNotAssignedToGroup( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("findByPermissionNotAssignedToGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void addPermissionTheGroup( Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addPermissionTheGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append("");
        log.error(error);
    }

    public static void removePermissionTheGroup( Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("removePermissionTheGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append("");
        log.error(error);
    }


    public static void selectListUser(Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("selectListUser");
        error.append(". Error: ").append(message);
        error.append(". User").append(userSession == null ? "null" : userSession.getUsername());
    }

    public static void findByPermissionOfGroup( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("findByPermissionOfGroup");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void SuggestionGroupAndPermiissionData( Logger log, String message, UserSession userSession, ListGroupData groupData ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("SuggestionGroupAndPermiissionData");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(groupData);
        log.error(error);
    }

    public static void getAllScope( Logger log, String message, UserSession userSession ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void getAllScopeDetailByIdUserScope( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllScopeDetailByIdUserScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void getAllScopeDetail( Logger log, String message, UserSession userSession ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getAllScopeDetail");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        log.error(error);
    }

    public static void addNewCatScope( Logger log, String message, UserSession userSession, CatalogScope scope ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewCatScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(scope);
        log.error(error);
    }

    public static void editCatScope( Logger log, String message, UserSession userSession, CatalogScope scope ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("editCatScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(scope);
        log.error(error);
    }

    public static void getByIdCatScope( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getByIdCatScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void deleteCatScope( Logger log, String message, UserSession userSession, CatalogScope scope ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteCatScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(scope);
        log.error(error);
    }

    public static void addNewScope( Logger log, String message, UserSession userSession, scopeData data ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addNewScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(data);
        log.error(error);
    }

    public static void updateScope( Logger log, String message, UserSession userSession, scopeData data ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("updateScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(data);
        log.error(error);
    }

    public static void deleteScope( Logger log, String message, UserSession userSession, scopeData data ) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("deleteScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User data: ").append(data);
        log.error(error);
    }

    public static void getByIdScope( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("getByIdScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void findByPermissionNotAssignedToScope( Logger log, String message, UserSession userSession, Integer id) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("findByPermissionNotAssignedToScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append(id);
        log.error(error);
    }

    public static void addPermissionTheScope( Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("addPermissionTheScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append("");
        log.error(error);
    }

    public static void removePermissionTheScope( Logger log, String message, UserSession userSession) {
        StringBuilder error = new StringBuilder();
        error.append("Method: ").append("removePermissionTheScope");
        error.append(". Error: ").append(message);
        error.append(". User: ").append(userSession == null ? "null" : userSession.getUsername());
        error.append(". User catalog: ").append("");
        log.error(error);
    }
}
