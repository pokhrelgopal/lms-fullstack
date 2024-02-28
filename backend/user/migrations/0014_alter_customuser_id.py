# Generated by Django 5.0.1 on 2024-01-10 11:37

import shortuuid.main
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("user", "0013_alter_customuser_id"),
    ]

    operations = [
        migrations.AlterField(
            model_name="customuser",
            name="id",
            field=models.CharField(
                default=shortuuid.main.ShortUUID.uuid,
                editable=False,
                max_length=22,
                primary_key=True,
                serialize=False,
                verbose_name="ID",
            ),
        ),
    ]
