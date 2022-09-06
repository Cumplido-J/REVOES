export const VIEW_TEACHER_ID = "TEACHERS/VIEW_TEACHER_ID";
export const VIEW_TEACHER = "TEACHERS/VIEW_TEACHER";

export function setTeacherId(teacher) {
	return {
		type: VIEW_TEACHER_ID,
		teacher
	}
}

export function setTeacherView(teacher) {
	return {
		type: VIEW_TEACHER,
		teacher
	}
}

