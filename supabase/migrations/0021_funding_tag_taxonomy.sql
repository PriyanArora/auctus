update public.funding as f
set tags = (
  select array_agg(distinct tag order by tag) as tags
  from unnest(array_remove(array[
    case
      when f.type = 'business_grant' then 'Business'
      when f.type = 'scholarship' then 'Student'
      when f.type = 'research_grant' then 'Professor'
    end,
    case when f.type = 'scholarship' then 'Scholarship' end,
    case when f.type = 'research_grant' then 'Research' end,
    case
      when lower(coalesce(f.provider, '') || ' ' || coalesce(f.scraped_from, '')) ~ '(ised|nserc|sshrc|indigenous services canada|government of canada)'
        then 'Federal'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(new brunswick|nova scotia|prince edward island|newfoundland|labrador|quebec|ontario|manitoba|saskatchewan|alberta|british columbia|yukon|northwest territories|nunavut|provincial|toronto|vancouver|calgary|edmonton|winnipeg|halifax|fredericton|moncton)'
        then 'Provincial'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(stem|science|technology|engineering|math|mathematics|computer|data|health|medicine|nursing|kinesiology|architecture|economics|research|nserc|digital|clean|energy)'
        then 'STEM'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(art|arts|humanities|design|music|creative|sshrc|social sciences|social innovation)'
        then 'Arts'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(health|medicine|nursing|kinesiology)'
        then 'Health'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(bursary|need|indigenous)'
        then 'Need-based'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(scholarship|award|merit|leadership)'
        then 'Merit-based'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(international|educanada)'
        then 'International'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.category, '') || ' ' || array_to_string(coalesce(f.tags, '{}'), ' ')) ~ '(indigenous|aboriginal|first nations|metis|inuit)'
        then 'Indigenous'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(graduate|masters|doctoral|phd)'
        then 'Graduate'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(trade|apprentice|apprenticeship)'
        then 'Trades'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(leadership|community)'
        then 'Leadership'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(growth|scale|expansion)'
        then 'Growth'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(digital|software|ecommerce|technology)'
        then 'Digital'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(export|market expansion)'
        then 'Export'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(sustainability|clean|energy|environment)'
        then 'Sustainability'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(startup|start-up|validation|venture)'
        then 'Startup'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(discovery)'
        then 'Discovery'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(partnership|partner|industry)'
        then 'Partnership'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(equipment|facility|facilities)'
        then 'Equipment'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(interdisciplinary|team|catalyst)'
        then 'Interdisciplinary'
    end,
    case
      when lower(coalesce(f.name, '') || ' ' || coalesce(f.description, '') || ' ' || coalesce(f.category, '')) ~ '(social sciences|social innovation|humanities|sshrc)'
        then 'Social Sciences'
    end
  ], null)) as tag
);
