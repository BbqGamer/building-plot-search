from collections import defaultdict
from typing import Optional


def get_all_purposes(mpzp):
    purposes = sorted(mpzp[['GRUPA', 'PODGRUPA']].drop_duplicates() \
                  .itertuples(index=False, name=None))
    
    purposes_dict = defaultdict(list)
    for k, v in purposes:
        purposes_dict[k].append(v)
    return purposes_dict


def get_purpose_region(mpzp, group: Optional[str], subgroup: Optional[str]):
    if subgroup:
        filtered = mpzp[mpzp['PODGRUPA'] == subgroup] 
    else:
        filtered = mpzp[mpzp['GRUPA'] == group]
    return filtered.geometry.unary_union

