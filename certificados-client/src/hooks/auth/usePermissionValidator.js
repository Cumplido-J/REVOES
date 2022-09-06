import { useSelector } from "react-redux";

const usePermissionValidator = () => {
  const currentPermissions = useSelector(
    (store) => store.permissionsReducer.permissions
  );
  const currentUserHasPermissions = ({
    permissions = [],
    allPermissions = true,
  }) =>
    permissions?.[allPermissions ? "every" : "some"]((p) =>
      currentPermissions.includes(p)
    );
  return [currentUserHasPermissions];
};

export default usePermissionValidator;
