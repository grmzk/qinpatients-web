from datetime import datetime, timedelta

from qinpatients.settings import CACHE_TTL, CACHE_TTL_LONG, CACHE_TTL_SHORT

from .classes.case_diseases import CaseDisease
from .classes.diagnosis_mkb import DiagnosisMkb
from .classes.doctors import Doctor
from .classes.movements import Movement
from .classes.notices import Notice
from .classes.patients import Patient
from .classes.surgeries import Surgery
from .firebird_db import fb_select_data
from .utils import (
    get_address_from_array,
    get_diary_today,
    strip_undigitalize_string,
)


def get_from_db(
    where: str,
    params: list,  # noqa: C901
    order_by: str | None = None,
    rows: int | None = None,
    cache_ttl: int = CACHE_TTL,
) -> list:
    delimiter = "<|>"
    query = (
        "SELECT patient.id, "
        "       patient.fm, "
        "       patient.im, "
        "       patient.ot, "
        "       patient.dtr, "
        "       patient.pol, "
        "       workplace.rab, "
        "       patient.rodst, "
        "       state.field_value "
        f"          || '{delimiter}' || region.field_value "
        f"          || '{delimiter}' || region_district.field_value "
        f"          || '{delimiter}' || locality.field_value "
        f"          || '{delimiter}' || locality_district.field_value "
        f"          || '{delimiter}' || street.field_value "
        f"          || '{delimiter}' || house.field_value "
        f"          || '{delimiter}' || letter.field_value "
        f"          || '{delimiter}' || building.field_value "
        f"          || '{delimiter}' || flat.field_value, "
        "       main_card.id, "
        "       main_card.d_in, "
        "       main_card.d_out, "
        "       department.short, "
        "       main_card.remzal, "
        "       main_card.dsnapr, "
        "       main_card.dspriem, "
        "       main_card.id_dvig, "
        "       main_card.id_otkaz, "
        "       inpatient_department.short, "
        "       main_card.n_card2, "
        "       main_card.n_card1, "
        "       doctor.last_name "
        "           || ' ' || doctor.first_name "
        "           || ' ' || doctor.middle_name, "
        "       movement.visit_id, "
        "       movement.nn, "
        "       movement_department.short, "
        "       bed_type.name, "
        "       movement.d_in, "
        "       movement.d_out, "
        "       operations.surgery_id, "
        "       operations.reg_surgery_name, "
        "       operations.d, "
        "       operation_department.short, "
        "       operation_doctor.last_name "
        "           || ' ' || operation_doctor.first_name "
        "           || ' ' || operation_doctor.middle_name, "
        "       inpatient_mkb.kod_ds, "
        "       inpatient_mkb.ds, "
        "       inpatient_diagnosis.script, "
        "       notice.nn, "
        "       notice.date_soob, "
        "       notice_where.name, "
        "       notice.kto_soob, "
        "       notice.kto_pr, "
        "       stat_card.d_vip, "
        "       result.name, "
        "       inpatient_doctor.last_name "
        "           || ' ' || inpatient_doctor.first_name "
        "           || ' ' || inpatient_doctor.middle_name, "
        "       trauma_type.name, "
        "       directed.name, "
        "       directed_from.name "
        "FROM main_card "
        "   LEFT JOIN pacient patient ON main_card.id_pac = patient.id "
        "   LEFT JOIN rabota workplace ON main_card.id_rab = workplace.id "
        "   LEFT JOIN person_address_fields state "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 1 ) "
        "   LEFT JOIN person_address_fields region "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 2 ) "
        "   LEFT JOIN person_address_fields region_district "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 3 ) "
        "   LEFT JOIN person_address_fields locality "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 4 ) "
        "   LEFT JOIN person_address_fields locality_district "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 5 ) "
        "   LEFT JOIN person_address_fields street "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 6 ) "
        "   LEFT JOIN person_address_fields house "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 7 ) "
        "   LEFT JOIN person_address_fields letter "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 8 ) "
        "   LEFT JOIN person_address_fields building "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 9 ) "
        "   LEFT JOIN person_address_fields flat "
        "       ON ( patient.id_adr = person_address_fields.addr_id "
        "               AND person_address_fields.ord = 10 ) "
        "   LEFT JOIN priemnic department "
        "       ON main_card.id_priem = department.id "
        "   LEFT JOIN priemnic inpatient_department "
        "       ON main_card.id_gotd = inpatient_department.id "
        "   LEFT JOIN doctor ON main_card.amb_doc_id = doctor.doctor_id "
        "   LEFT JOIN dvigenie movement ON main_card.id = movement.id "
        "   LEFT JOIN priemnic movement_department "
        "       ON movement.kod_otd = movement_department.id "
        "   LEFT JOIN bed_type movement_bed_type "
        "       ON movement.kod_prof = movement_bed_type.bed_type_id "
        "   LEFT JOIN stat_card ON main_card.id = stat_card.id "
        "   LEFT JOIN dvig result ON stat_card.id_ishod = result.id "
        "   LEFT JOIN doctor inpatient_doctor "
        "       ON stat_card.hosp_doc_id = inpatient_doctor.doctor_id "
        "   LEFT JOIN operations ON main_card.id = operations.case_id "
        "   LEFT JOIN priemnic operation_department "
        "       ON operations.kod_otd = operation_department.id "
        "   LEFT JOIN doctor operation_doctor "
        "       ON operations.doctor_id = operation_doctor.doctor_id "
        "   LEFT JOIN tr trauma_type ON main_card.id_tr = trauma_type.id "
        "   LEFT JOIN napr directed ON main_card.id_napr = directed.id "
        "   LEFT JOIN lpu directed_from "
        "       ON main_card.id_lpufrom = directed_from.id "
        "   LEFT JOIN diagnoz inpatient_mkb "
        "       ON main_card.id = inpatient_mkb.id "
        "   LEFT JOIN mkb10 inpatient_diagnosis "
        "       ON inpatient_mkb.ds = inpatient_diagnosis.name "
        "   LEFT JOIN soob notice ON main_card.id = notice.id "
        "   LEFT JOIN dvig notice_where ON notice.kod_kuda = notice_where.id "
    )
    query += f" WHERE {where}"
    if order_by:
        query += f" ORDER BY {order_by}"
    if rows:
        query += f" ROWS {rows}"
    response = fb_select_data(
        query,
        params,
        cache_ttl,
    )
    grouped_response = {}
    for item in response:
        if grouped_response.get(item[9]):
            grouped_response[item[9]].append(item)
            continue
        grouped_response[item[9]] = [item]
    cleaned_response = []
    for item_list in grouped_response.values():
        cleaned_item = list(item_list[0][:22])
        movements_ids: list[int] = []
        movements = []
        surgeries_ids: list[int] = []
        surgeries = []
        inpatient_diagnosis_ids: list[int] = []
        inpatient_diagnosis = []
        notices_ids: list[int] = []
        notices = []
        for item in item_list:
            if item[22] and item[22] not in movements_ids:
                movements.append(Movement(*item[23:28]))
                movements_ids.append(item[22])
            if item[28] and item[28] not in surgeries_ids:
                surgeries.append(
                    Surgery(
                        item[29].strip().capitalize() if item[29] else None,
                        *item[30:33],
                    )
                )
                surgeries_ids.append(item[28])
            if item[33] and item[33] not in inpatient_diagnosis_ids:
                inpatient_diagnosis.append(DiagnosisMkb(*item[33:36]))
                inpatient_diagnosis_ids.append(item[33])
            if item[36] and item[36] not in notices_ids:
                notices.append(Notice(*item[37:41]))
                notices_ids.append(item[36])
        movements.sort(key=lambda movement: movement.order)
        surgeries.sort(key=lambda surgery: surgery.date)
        inpatient_diagnosis.sort(key=lambda diagnosis: diagnosis.order)
        notices.sort(key=lambda notice: notice.date)
        cleaned_item.append(movements)
        cleaned_item.append(surgeries)
        cleaned_item.append(inpatient_diagnosis)
        cleaned_item.append(notices)
        cleaned_item.extend(item_list[0][41:])
        cleaned_response.append(cleaned_item)
    data = []
    for item in cleaned_response:
        patient = Patient(*item[:9])
        if patient.address:
            patient.address = get_address_from_array(
                patient.address.split(delimiter)
            )
        data.append(
            {"patient": patient, "case_disease": CaseDisease(*item[9:])}
        )
    return data


def get_doctors_from_db() -> dict[str, list[Doctor]]:
    query = (
        "SELECT doctor.last_name, "
        "       doctor.first_name, "
        "       doctor.middle_name, "
        "       department_unit.name, "
        "       doctor.work_start_date, "
        "       doctor.work_end_date "
        "FROM doctor "
        "   LEFT JOIN department_unit "
        "       ON doctor.spec_id = department_unit.speciality_id "
        "ORDER BY doctor_id "
    )
    response = fb_select_data(query)
    result: dict[str, list[Doctor]] = {}
    for item in response:
        doctor = Doctor(
            strip_undigitalize_string(item[0]),
            strip_undigitalize_string(item[1]),
            strip_undigitalize_string(item[2]),
            *item[3:],
        )
        if result.get(doctor.get_full_name().upper()):
            result[doctor.get_full_name().upper()].append(doctor)
            continue
        result[doctor.get_full_name().upper()] = [doctor]
    return result


def get_summary_data(start_datetime: datetime, end_datetime: datetime) -> list:
    cache_ttl = (
        CACHE_TTL_SHORT
        if (
            (start_datetime.date() == get_diary_today())
            or (start_datetime.date() == get_diary_today() + timedelta(days=1))
        )
        else CACHE_TTL_LONG
    )
    return get_from_db(
        where="main_card.d_in BETWEEN ? AND ?",
        order_by="main_card.id",
        params=[start_datetime - timedelta(days=1), end_datetime],
        cache_ttl=cache_ttl,
    )


def get_patient_data(patient_id: int):
    return get_from_db(
        where="main_card.id_pac = ?",
        order_by="main_card.id",
        rows=1,
        params=[patient_id],
        cache_ttl=CACHE_TTL_LONG,
    )


def get_patient_history_data(patient_id: int) -> list:
    return get_from_db(
        where="main_card.id_pac = ?",
        order_by="main_card.id",
        params=[patient_id],
        cache_ttl=CACHE_TTL,
    )


def get_search_data(
    fullname: str,
    start_date: datetime,
    end_date: datetime,
    department: str | None = None,
) -> list:
    fullname_prepared = (
        "%".join(fullname.split()).upper().replace("Е", "_").replace("Ё", "_")
        + "%"
    )
    where = (
        "main_card.id_pac IN ("
        "         SELECT id "
        "         FROM pacient "
        "         WHERE UPPER((CASE WHEN pacient.fm IS NULL "
        "                           THEN CAST('' AS VARCHAR(24)) "
        "                           ELSE pacient.fm END) "
        "                     || ' ' || "
        "                     (CASE WHEN pacient.im IS NULL "
        "                           THEN CAST('' AS VARCHAR(24)) "
        "                           ELSE pacient.im END) "
        "                     || ' ' || "
        "                     (CASE WHEN pacient.ot IS NULL "
        "                           THEN CAST('' AS VARCHAR(24)) "
        "                           ELSE pacient.ot END)) "
        "               LIKE ?"
        "     ) "
        "     AND (main_card.d_in BETWEEN ? AND ?)"
    )
    params = [fullname_prepared, start_date, end_date]

    if department and department != "ВСЕ ОТДЕЛЕНИЯ":
        if department == "РЕАН ЗАЛ":
            where += " AND (main_card.remzal = 'T')"
        else:
            where += (
                " AND (main_card.id_priem IN ("
                "         SELECT id "
                "         FROM priemnic "
                "         WHERE short = ?"
                "     )"
                " )"
            )
            params.append(department)

    return get_from_db(
        where=where,
        order_by="main_card.id",
        # rows=200,
        params=params,
        cache_ttl=CACHE_TTL_LONG,
    )


def get_last_case_disease_data(main_card_last_id: int) -> list[dict]:
    return get_from_db(
        where="main_card.id > ?",
        order_by="main_card.id",
        params=[main_card_last_id],
    )
