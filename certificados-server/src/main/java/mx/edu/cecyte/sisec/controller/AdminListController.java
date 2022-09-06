package mx.edu.cecyte.sisec.controller;

import lombok.extern.log4j.Log4j;
import mx.edu.cecyte.sisec.classes.AdminFilter;
import mx.edu.cecyte.sisec.dto.SelectListUser;
import mx.edu.cecyte.sisec.dto.UserSearchResult;
import mx.edu.cecyte.sisec.dto.catalogs.Catalog;
import mx.edu.cecyte.sisec.dto.catalogs.CatalogScope;
import mx.edu.cecyte.sisec.dto.user.*;
import mx.edu.cecyte.sisec.log.StudentLogger;
import mx.edu.cecyte.sisec.log.UserLogger;
import mx.edu.cecyte.sisec.service.UserService;
import mx.edu.cecyte.sisec.shared.AppException;
import mx.edu.cecyte.sisec.shared.CustomResponseEntity;
import mx.edu.cecyte.sisec.shared.LoggedUser;
import mx.edu.cecyte.sisec.shared.UserSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/adminList")
@Log4j
public class AdminListController {
    @Autowired private UserService userService;

    /*@GetMapping
    @PreAuthorize("hasRole('ROLE_DEV')")
    public ResponseEntity<?> adminSearch(@LoggedUser UserSession userSession,
                                         @RequestParam(defaultValue = "0") Integer adminTypeId,
                                         @RequestParam(defaultValue = "0") Integer stateId,
                                         @RequestParam(defaultValue = "0") Integer schoolId,
                                         @RequestParam(defaultValue = "0") Integer checkAdminNivel,
                                         @RequestParam(defaultValue = "0") Integer adminSchoolId,
                                         @RequestParam(defaultValue = "0") Integer superUserId) {
        AdminFilter adminFilter = new AdminFilter(adminTypeId, stateId, schoolId,checkAdminNivel, adminSchoolId, superUserId);
        try {
            //List<UserSearchResult> resultList = userService.adminSearch(userSession.getId(), adminFilter);
            //return CustomResponseEntity.OK(resultList);
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.adminSearch(log, exception.getMessage(), userSession, adminTypeId);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.adminSearch(log, exception.toString(), userSession, adminTypeId);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getUserData(@LoggedUser UserSession userSession,
                                         @PathVariable String userName) {
        try {
            //UserData userData = userService.getUserData(userName,userSession.getId());
            //return CustomResponseEntity.OK(userData);
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            StudentLogger.getStudentData(log, exception.getMessage(), userSession, userName);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getStudentData(log, exception.toString(), userSession, userName);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/edit/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> editUser(@LoggedUser UserSession userSession,
                                      @PathVariable String userName,
                                      @RequestBody UserData userData) {
        try {
            //userData =userService.editUser(userData, userName, userSession.getId());
            //return CustomResponseEntity.OK(userData);
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.editUser(log, exception.getMessage(), userSession, userData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.editUser(log, exception.toString(), userSession, userData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addNewUser(@LoggedUser UserSession userSession,
                                        @RequestBody UserData userData) {
        try {
            //userData = userService.addNewUser(userData,userSession.getId());
            //return CustomResponseEntity.OK(userData);
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addNewUser(log, exception.getMessage(), userSession, userData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addNewUser(log, exception.toString(), userSession, userData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }*/

    @PostMapping("/password/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> editUserPassword(@LoggedUser UserSession userSession,
                                              @PathVariable String userName,
                                              @RequestBody UserData userData) {
        try {
            userService.editUserPassword(userName,userSession.getId(),userData);
            return CustomResponseEntity.OK("Se ha editado correctamente el usuario");
        } catch (AppException exception) {
            UserLogger.editUserPassword(log, exception.getMessage(), userSession, userData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.editUserPassword(log, exception.toString(), userSession, userData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addGroup")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addGroup( @LoggedUser UserSession userSession,
                                       @RequestBody GroupData groupData ) {
        try {
            userService.addGroup(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addGroup(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addGroup(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/findByGroup/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> findByGroup( @LoggedUser UserSession userSession,
                                          @PathVariable Integer id ) {
        try {

            GroupData groupData= userService.findByGroup(id,userSession.getId());

            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.findByGroup(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.findByGroup(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updateGroup")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> updateGroup( @LoggedUser UserSession userSession,
                                       @RequestBody GroupData groupData ) {
        try {

            userService.updateGroup(groupData,userSession.getId());
            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.updateGroup(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.updateGroup(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteGroup")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteGroup( @LoggedUser UserSession userSession,
                                          @RequestBody GroupData groupData ) {
        try {

            userService.deleteGroup(groupData,userSession.getId());
            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.deleteGroup(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.deleteGroup(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addPermission")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addPermission( @LoggedUser UserSession userSession,
                                       @RequestBody GroupData groupData ) {
        try {
            userService.addPermission(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addPermission(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addPermission(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/findByPermission/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> findByPermission( @LoggedUser UserSession userSession,
                                          @PathVariable Integer id ) {
        try {

            GroupData groupData= userService.findByPermission(id,userSession.getId());

            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.findByPermission(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.findByPermission(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updatePermission")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> updatePermission( @LoggedUser UserSession userSession,
                                          @RequestBody GroupData groupData ) {
        try {

            userService.updatePermission(groupData,userSession.getId());
            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.updatePermission(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.updatePermission(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deletePermission")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deletePermission( @LoggedUser UserSession userSession,
                                          @RequestBody GroupData groupData ) {
        try {

            userService.deletePermission(groupData,userSession.getId());
            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.deletePermission(log, exception.getMessage(), userSession, groupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.deletePermission(log, exception.toString(), userSession, groupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/findByPermissionNotAssignedToGroup/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> findByPermissionNotAssignedToGroup( @LoggedUser UserSession userSession,
                                               @PathVariable Integer id ) {
        try {
            Set< TransferPermissionData > groupData= userService.findByPermissionNotAssignedToGroup(id);
            return CustomResponseEntity.OK(groupData);
        } catch (AppException exception) {
            UserLogger.findByPermissionNotAssignedToGroup(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.findByPermissionNotAssignedToGroup(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @PostMapping("/addPermissionTheGroup")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addPermissionTheGroup( @LoggedUser UserSession userSession,
                                                    @RequestBody ListGroupData groupData ) {
        try {
            userService.addPermissionTheGroup(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addPermissionTheGroup(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addPermissionTheGroup(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/removePermissionTheGroup")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> removePermissionTheGroup( @LoggedUser UserSession userSession,
                                                       @RequestBody ListGroupData groupData ) {
        try {
            userService.removePermissionTheGroup(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.removePermissionTheGroup(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.removePermissionTheGroup(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @GetMapping("/selectListUser")
    @PreAuthorize("hasRole('ROLE_DEV')")
    public ResponseEntity<?> selectListUser(@LoggedUser UserSession userSession,
                                            @RequestParam(defaultValue = "0") Integer adminTypeId,
                                            @RequestParam(defaultValue = "0") Integer stateId,
                                            @RequestParam(defaultValue = "0") Integer schoolId,
                                            @RequestParam(defaultValue = "") String username){
        try {
            List<SelectListUser> resultList = userService.selectListUser(userSession.getId(), adminTypeId, stateId, schoolId, username);
            return CustomResponseEntity.OK(resultList);
        } catch (AppException exception) {
            UserLogger.selectListUser(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.selectListUser(log, exception.getMessage(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/findByPermissionOfGroup/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> findByPermissionOfGroup( @LoggedUser UserSession userSession,
                                               @PathVariable Integer id ) {
        try {

            List<TransferPermissionData> permissionData= userService.findByPermissionOfGroup(id,userSession.getId());

            return CustomResponseEntity.OK(permissionData);
        } catch (AppException exception) {
            UserLogger.findByPermissionOfGroup(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.findByPermissionOfGroup(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/getSuggestionGroupAndPermissionData")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> SuggestionGroupAndPermiissionData( @LoggedUser UserSession userSession,
                                                                @RequestBody ListGroupData listGroupData) {
        try {
            List< SuggestionGroupAndPermiissionData> suggestionGroupAndPermiissionData= userService.SuggestionGroupAndPermiissionData(listGroupData,userSession.getId());
            return CustomResponseEntity.OK(suggestionGroupAndPermiissionData);
        } catch (AppException exception) {
            UserLogger.SuggestionGroupAndPermiissionData(log, exception.getMessage(), userSession, listGroupData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.SuggestionGroupAndPermiissionData(log, exception.toString(), userSession, listGroupData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllScope( @LoggedUser UserSession userSession ) {
        try {

            List<Catalog> scope= userService.getAllScope();

            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.getAllScope(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getAllScope(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllScopeDescription")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllScope2( @LoggedUser UserSession userSession ) {
        try {

            List<Catalog> scope= userService.getAllScope2();

            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.getAllScope(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getAllScope(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllScopeDetailByIdUserScope/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllScopeDetailByIdUserScope( @LoggedUser UserSession userSession,
                                                      @PathVariable Integer id ) {
        try {
            List< SuggestionGroupAndPermiissionData > getAllScopeDetailByIdUserScope= userService.getAllScopeDetailByIdUserScope(id);

            return CustomResponseEntity.OK(getAllScopeDetailByIdUserScope);
        } catch (AppException exception) {
            UserLogger.getAllScopeDetailByIdUserScope(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getAllScopeDetailByIdUserScope(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @PostMapping("/addNewUser")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addNewUser(@LoggedUser UserSession userSession,
                                        @RequestBody UserData userData) {
        try {
            System.out.println(userData);
            UserData userDataR = userService.addNewUser(userData,userSession.getId());
            return CustomResponseEntity.OK(userDataR);
        } catch (AppException exception) {
            UserLogger.addNewUser(log, exception.getMessage(), userSession, userData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addNewUser(log, exception.toString(), userSession, userData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getUserData(@LoggedUser UserSession userSession,
                                         @PathVariable String userName) {
        try {
            UserData userData = userService.getUserData(userName,userSession.getId());
            return CustomResponseEntity.OK(userData);
        } catch (AppException exception) {
            StudentLogger.getStudentData(log, exception.getMessage(), userSession, userName);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            StudentLogger.getStudentData(log, exception.toString(), userSession, userName);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/edit/{userName}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> editUser(@LoggedUser UserSession userSession,
                                      @PathVariable String userName,
                                      @RequestBody UserData userData) {
        try {
            UserData userDataR =userService.editUser(userData, userName, userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.editUser(log, exception.getMessage(), userSession, userData);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.editUser(log, exception.toString(), userSession, userData);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getAllScopeDetail")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getAllScopeDetail( @LoggedUser UserSession userSession ) {
        try {

            List< CatalogScope > scope= userService.getAllScopeDetail();

            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.getAllScopeDetail(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getAllScopeDetail(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/addNewCatScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addNewCatScope(@LoggedUser UserSession userSession,
                                        @RequestBody CatalogScope scope) {
        try {
            userService.addNewCatScope(scope,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addNewCatScope(log, exception.getMessage(), userSession, scope);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addNewCatScope(log, exception.toString(), userSession, scope);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/editCatScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> editCatScope(@LoggedUser UserSession userSession,
                                            @RequestBody CatalogScope scope) {
        try {
            userService.editCatScope(scope,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.editCatScope(log, exception.getMessage(), userSession, scope);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.editCatScope(log, exception.toString(), userSession, scope);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getByIdCatScope/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getByIdCatScope( @LoggedUser UserSession userSession,
                                                             @PathVariable Integer id ) {
        try {
            CatalogScope scope= userService.getByIdCatScope(id);
            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.getByIdCatScope(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getByIdCatScope(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteCatScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteCatScope( @LoggedUser UserSession userSession,
                                          @RequestBody CatalogScope scope ) {
        try {

            userService.deleteCatScope(scope,userSession.getId());
            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.deleteCatScope(log, exception.getMessage(), userSession, scope);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.deleteCatScope(log, exception.toString(), userSession, scope);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @PostMapping("/addNewScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addNewScope(@LoggedUser UserSession userSession,
                                          @RequestBody scopeData data) {
        try {
            userService.addNewScope(data, userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addNewScope(log, exception.getMessage(), userSession, data);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addNewScope(log, exception.toString(), userSession, data);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/getByIdScope/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> getByIdScope( @LoggedUser UserSession userSession,
                                              @PathVariable Integer id ) {
        try {
            scopeData scope= userService.getByIdScope(id);
            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.getByIdScope(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.getByIdScope(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/updateScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> updateScope(@LoggedUser UserSession userSession,
                                         @RequestBody scopeData data) {
        try {
            userService.updateScope(data, userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.updateScope(log, exception.getMessage(), userSession, data);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.updateScope(log, exception.toString(), userSession, data);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/deleteScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> deleteScope( @LoggedUser UserSession userSession,
                                             @RequestBody scopeData data ) {
        try {

            userService.deleteScope(data,userSession.getId());
            return CustomResponseEntity.OK(data);
        } catch (AppException exception) {
            UserLogger.deleteScope(log, exception.getMessage(), userSession, data);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.deleteScope(log, exception.toString(), userSession, data);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @GetMapping("/findByPermissionNotAssignedToScope/{id}")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> findByPermissionNotAssignedToScope( @LoggedUser UserSession userSession,
                                                                 @PathVariable Integer id ) {
        try {
            Set< TransferPermissionData > scope= userService.findByPermissionNotAssignedToScope(id);
            return CustomResponseEntity.OK(scope);
        } catch (AppException exception) {
            UserLogger.findByPermissionNotAssignedToScope(log, exception.getMessage(), userSession, id);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.findByPermissionNotAssignedToScope(log, exception.toString(), userSession, id);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }


    @PostMapping("/addPermissionTheScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> addPermissionTheCat( @LoggedUser UserSession userSession,
                                                    @RequestBody ListGroupData groupData ) {
        try {
            userService.addPermissionTheScope(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.addPermissionTheScope(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.addPermissionTheScope(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

    @PostMapping("/removePermissionTheScope")
    @PreAuthorize("hasAnyRole('ROLE_DEV')")
    public ResponseEntity<?> removePermissionTheScope( @LoggedUser UserSession userSession,
                                                       @RequestBody ListGroupData groupData ) {
        try {
            userService.removePermissionTheScope(groupData,userSession.getId());
            return CustomResponseEntity.OK(null);
        } catch (AppException exception) {
            UserLogger.removePermissionTheScope(log, exception.getMessage(), userSession);
            return CustomResponseEntity.BAD_REQUEST(exception.getMessage());
        } catch (Exception exception) {
            UserLogger.removePermissionTheScope(log, exception.toString(), userSession);
            return CustomResponseEntity.INTERNAL_SERVER_ERROR();
        }
    }

}
