from collections import defaultdict


def get_all_purposes(mpzp):
    purposes = sorted(mpzp[['GRUPA', 'PODGRUPA']].drop_duplicates() \
                  .itertuples(index=False, name=None))
    
    purposes_dict = defaultdict(list)
    for k, v in purposes:
        purposes_dict[k].append(v)
    return purposes_dict

