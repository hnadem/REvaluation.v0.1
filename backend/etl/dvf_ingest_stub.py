"""
DVF ETL stub (France) - outline

Steps:
1. Download DVF dumps from https://www.data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/
2. Select relevant columns (date_mutation, valeur_fonciere, adresse_numero, adresse_... , superficie)
3. Geocode addresses if coordinates missing (use LocationIQ or IGN)
4. Normalize price/surface and insert into PostGIS `comps` table (geom from lon/lat)
5. Add source="DVF" and source_date

This script is a stub to be expanded. For large files use chunked processing.
"""
import pandas as pd
from sqlalchemy import create_engine
# Example:
# engine = create_engine('postgresql://rv_user:rv_pass@localhost:5432/rv_db')
# df = pd.read_csv('full_dvf_sample.csv', sep=';')
# process df -> compute price, filter residential, geocode missing coords
# use df.to_sql('comps', engine, if_exists='append', index=False)
