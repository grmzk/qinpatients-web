import logging
import os
from typing import Union

import fdb
from django.core.cache import cache
from dotenv import load_dotenv
from fdb.fbcore import Connection

from qinpatients.settings import CACHE_TTL

from .error_db import error_db
from .exceptions import FirebirdException

load_dotenv()

FB_DSN = os.getenv("FB_DSN", "")
FB_USER = os.getenv("FB_USER")
FB_PASSWORD = os.getenv("FB_PASSWORD")
FB_LIBRARY_NAME = os.getenv("FB_LIBRARY_NAME")


def connect_fdb():
    try:
        connection = fdb.connect(
            dsn=FB_DSN,
            sql_dialect=1,
            charset="WIN1251",
            user=FB_USER,
            password=FB_PASSWORD,
            connection_class=Connection,
            fb_library_name=FB_LIBRARY_NAME,
        )
    except Exception as e:
        error_db.error_access = True
        raise FirebirdException(e) from e
    return connection


def fb_select_data(
    select_query: str,
    parameters: Union[list, None] = None,
    cache_ttl: int = CACHE_TTL,
) -> list:
    params_hash = hash(frozenset(parameters))
    data = cache.get(params_hash)
    if data:
        return data
    connection = connect_fdb()
    cursor = connection.cursor()
    try:
        cursor.execute(select_query, parameters=parameters)
        data = cursor.fetchall()
    except Exception as error:
        logging.error(f"FDB QUERY: {error}")
        raise FirebirdException(error)
    finally:
        try:
            cursor.close()
            connection.close()
        except Exception as error:
            logging.error(f"FDB CLOSE: {error}")
    cache.set(params_hash, data, timeout=cache_ttl)
    logging.info("FDB QUERY SUCCESS")
    return data
